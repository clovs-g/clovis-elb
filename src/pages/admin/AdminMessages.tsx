import React, { useState } from 'react';
import { useMessages } from '../../hooks/useMessages';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const AdminMessages: React.FC = () => {

  // DEBUG: Show all states for troubleshooting
  const { messages, loading, error, updateStatus, deleteMessage } = useMessages();
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'resolved'>('all');

  // Debug output
  console.log('AdminMessages debug:', { messages, loading, error });

  // Show debug info on page for troubleshooting
  if (loading) {
    return <div style={{ padding: 32 }}>Loading messages...<br /><pre>{JSON.stringify({ loading, error }, null, 2)}</pre></div>;
  }
  if (error) {
    return <div style={{ padding: 32, color: 'red' }}>Error: {error}<br /><pre>{JSON.stringify({ error }, null, 2)}</pre></div>;
  }
  if (!messages || messages.length === 0) {
    return <div style={{ padding: 32 }}>No messages found.<br /><pre>{JSON.stringify({ messages }, null, 2)}</pre></div>;
  }

  const filteredMessages = messages.filter(
    (message) => filter === 'all' || message.status === filter
  );

  const handleStatusChange = async (id: string, newStatus: typeof filter) => {
    if (newStatus !== 'all') {
      await updateStatus(id, newStatus);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await deleteMessage(id);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <header className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Customer Messages</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and respond to incoming customer inquiries.
            </p>
          </header>

          <div className="mb-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {loading && <p className="text-center py-4">Loading messages...</p>}
            {error && <p className="text-center py-4 text-red-500">Error: {error}</p>}
            {!loading && !error && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMessages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No messages found.
                      </td>
                    </tr>
                  ) : (
                    filteredMessages.map((message) => (
                      <tr key={message.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{message.customer_name}</div>
                          <div className="text-sm text-gray-500">{message.customer_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{message.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={message.status}
                            onChange={(e) => handleStatusChange(message.id, e.target.value as any)}
                            className="text-sm rounded-md border-gray-300"
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(message.created_at), 'MMM d, yyyy, h:mm a')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/admin/messages/${message.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(message.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages; 