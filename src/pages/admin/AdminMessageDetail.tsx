import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, Trash2 } from 'lucide-react';
import { supabase, supabaseAdmin } from '../../lib/supabase';
import { useReplies } from '../../hooks/useReplies';
import { useMessages } from '../../hooks/useMessages';

const AdminMessageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Local state for message
  const [message, setMessage] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);

  const { replies, loading, error, fetchReplies, addReply } = useReplies();
  const { updateStatus, deleteMessage: deleteMessageHook } = useMessages();

  // choose service-role client if available
  const client = supabaseAdmin ?? supabase;

  const [replyBody, setReplyBody] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchMessage = async () => {
        setLoadingMessage(true);
        const { data, error } = await client.from('messages').select('*').eq('id', id).single();
        if (!error) setMessage(data);
        setLoadingMessage(false);
      };
      fetchMessage();
      fetchReplies(id);
    }
  }, [id, fetchReplies]);

  const handleSendReply = async () => {
    if (!id || !replyBody.trim()) return;
    setSending(true);
    setReplyError(null);
    const adminUserStr = localStorage.getItem('admin-user');
    const adminUserId = adminUserStr ? JSON.parse(adminUserStr).id : null;
    if (!adminUserId) {
      setReplyError('No admin user context');
      setSending(false);
      return;
    }
    const ok = await addReply(id, replyBody, adminUserId);
    if (ok) {
      // Send email to customer via Supabase Edge Function
      const { error: mailError } = await supabase.functions.invoke('send-reply-email', {
        body: {
          to: message.customer_email,
          subject: `Re: ${message.subject}`,
          html: replyBody,
        },
      });
      if (mailError) {
        console.error('Mail send error', mailError);
      }
      setReplyBody('');
      await updateStatus(id, 'replied');
    } else {
      setReplyError('Failed to send reply');
    }
    setSending(false);
  };

  const markResolved = async () => {
    if (!id) return;
    setStatusUpdating(true);
    await updateStatus(id, 'resolved');
    setMessage((prev: any) => (prev ? { ...prev, status: 'resolved' } : prev));
    setStatusUpdating(false);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (confirm('Delete this message?')) {
      await deleteMessageHook(id);
      navigate('/admin/messages');
    }
  };

  if (loadingMessage) {
    return (
      <div className="p-6 text-center">Loading message...</div>
    );
  }

  if (!message) {
    return (
      <div className="p-6 text-center text-red-600">Message not found</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate('/admin/messages')}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Messages
      </button>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{message.subject}</h2>
            <p className="text-sm text-gray-600">
              From: {message.customer_name} &lt;{message.customer_email}&gt;
            </p>
            <p className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100">{message.status}</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100">{message.priority}</span>
          </div>
        </div>
        <p className="whitespace-pre-wrap text-gray-800 border-t pt-4">{message.body}</p>
        <div className="flex space-x-2 pt-4 border-t">
          {message.status !== 'resolved' && (
            <button
              onClick={markResolved}
              disabled={statusUpdating}
              className="flex items-center space-x-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Mark Resolved</span>
            </button>
          )}
          <button
            onClick={handleDelete}
            className="flex items-center space-x-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Thread</h3>
        <div className="space-y-3">
          {loading && <p>Loading replies...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {replies.map((r) => (
            <div key={r.id} className="bg-white border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Admin</span> - {new Date(r.sent_at).toLocaleString()}
              </p>
              <div className="prose" dangerouslySetInnerHTML={{ __html: r.body_html }} />
            </div>
          ))}
          {replies.length === 0 && !loading && <p className="text-gray-500">No replies yet.</p>}
        </div>
      </div>

      {/* Reply composer */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Send Reply</h3>
        {replyError && <p className="text-red-600 text-sm">{replyError}</p>}
        <textarea
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          rows={6}
          className="w-full border rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Type your reply in rich text (basic HTML supported)"
        />
        <button
          onClick={handleSendReply}
          disabled={sending}
          className="flex items-center space-x-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          <span>{sending ? 'Sending...' : 'Send Reply'}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminMessageDetail; 