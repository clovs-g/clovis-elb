import { useState, useCallback } from 'react';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { Database } from '../lib/supabase';

type Reply = Database['public']['Tables']['message_replies']['Row'];

type UseRepliesReturn = {
  replies: Reply[];
  loading: boolean;
  error: string | null;
  fetchReplies: (messageId: string) => Promise<void>;
  addReply: (messageId: string, bodyHtml: string, adminUserId: string) => Promise<boolean>;
};

export const useReplies = (): UseRepliesReturn => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const client = supabaseAdmin ?? supabase;

  const fetchReplies = useCallback(async (messageId: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await client
      .from('message_replies')
      .select('*')
      .eq('message_id', messageId)
      .order('sent_at', { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setReplies(data as Reply[]);
    }
    setLoading(false);
  }, []);

  const addReply = useCallback(
    async (messageId: string, bodyHtml: string, adminUserId: string): Promise<boolean> => {
      const { error } = await client.from('message_replies').insert([
        { message_id: messageId, body_html: bodyHtml, admin_user_id: adminUserId },
      ]);
      if (error) {
        setError(error.message);
        return false;
      }
      // Update local list
      setReplies((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(), // temp id until fetch
          message_id: messageId,
          admin_user_id: adminUserId,
          body_html: bodyHtml,
          sent_at: new Date().toISOString(),
        } as Reply,
      ]);
      return true;
    },
    [],
  );

  return { replies, loading, error, fetchReplies, addReply };
}; 