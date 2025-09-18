import { useState, useEffect, useCallback } from 'react';
import { supabaseAdmin } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import { useAdminAuth } from '../contexts/AdminAuthContext';

type Message = Database['public']['Tables']['messages']['Row'];

interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  updateStatus: (id: string, status: 'new' | 'read' | 'replied' | 'resolved') => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

export const useMessages = (): UseMessagesReturn => {
  const { user } = useAdminAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper: choose service-role client when present (avoids RLS issues on admin dashboard)
  // Always use supabaseAdmin for admin dashboard to bypass RLS
  if (!supabaseAdmin) throw new Error('supabaseAdmin is not configured. Please check your environment variables.');
  const client = supabaseAdmin;

  const fetchMessages = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await client
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setMessages(data || []);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch messages:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
        fetchMessages();

        const channel = client
        .channel('realtime-messages')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'messages' },
            () => {
            fetchMessages(); 
            }
        )
        .subscribe();

        return () => {
        client.removeChannel(channel);
        };
    }
  }, [user, fetchMessages]);

  const updateStatus = async (id: string, status: Message['status']) => {
    try {
      const { error: updateError } = await client
        .from('messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;
      
    } catch (e: any) {
      console.error('Failed to update message status:', e);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error: deleteError } = await client.from('messages').delete().eq('id', id);
      if (deleteError) throw deleteError;

      // remove from local state immediately
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (e: any) {
      console.error('Failed to delete message:', e);
    }
  };

  return { messages, loading, error, updateStatus, deleteMessage };
}; 