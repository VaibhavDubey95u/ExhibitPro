import { useState, useEffect } from 'react';
import { Mail, Trash2, MailOpen, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import Modal from '@components/ui/Modal';
import EmptyState from '@components/ui/EmptyState';
import Button from '@components/ui/Button';
import { getMessages, markMessageRead, deleteMessage } from '@services/messagesApi';

function formatDate(str) {
  return new Date(str).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function MessagesInbox() {
  const [messages, setMessages]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);

  const load = async () => {
    setLoading(true);
    try { setMessages(await getMessages()); }
    catch { toast.error('Failed to load messages.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleOpen = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      await markMessageRead(msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try { await deleteMessage(id); toast.success('Deleted.'); load(); setSelected(null); }
    catch { toast.error('Delete failed.'); }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <AdminLayout title="Messages Inbox" subtitle={`${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`}>
      {!loading && messages.length === 0 && (
        <EmptyState icon={Inbox} title="No messages yet" description="Messages from your contact form will appear here." />
      )}

      <div className="space-y-2">
        {messages.map(msg => (
          <div
            key={msg.id}
            onClick={() => handleOpen(msg)}
            className={`card p-4 flex items-start gap-4 cursor-pointer hover:border-brand-500 transition-all ${!msg.is_read ? 'border-brand-200 dark:border-brand-800' : ''}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {msg.is_read
                ? <MailOpen className="w-5 h-5 text-gray-400" />
                : <Mail className="w-5 h-5 text-brand-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-sm ${!msg.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                  {msg.name || 'Unknown'}
                </span>
                {!msg.is_read && <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />}
              </div>
              <p className="text-xs text-gray-500 mb-0.5">{msg.email} · {msg.phone}</p>
              {msg.subject && <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{msg.subject}</p>}
              <p className="text-xs text-gray-400 truncate">{msg.message}</p>
            </div>
            <div className="text-xs text-gray-400 flex-shrink-0">{formatDate(msg.created_at)}</div>
          </div>
        ))}
      </div>

      {/* Message detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Message" size="md">
        {selected && (
          <div className="space-y-4">
            <dl className="space-y-2 text-sm">
              <div className="flex gap-3"><dt className="font-medium text-gray-500 w-20">From:</dt><dd className="text-gray-900 dark:text-white">{selected.name}</dd></div>
              <div className="flex gap-3"><dt className="font-medium text-gray-500 w-20">Email:</dt><dd><a href={`mailto:${selected.email}`} className="text-brand-500 hover:underline">{selected.email}</a></dd></div>
              {selected.phone && <div className="flex gap-3"><dt className="font-medium text-gray-500 w-20">Phone:</dt><dd><a href={`tel:${selected.phone}`} className="text-brand-500">{selected.phone}</a></dd></div>}
              {selected.subject && <div className="flex gap-3"><dt className="font-medium text-gray-500 w-20">Subject:</dt><dd className="text-gray-900 dark:text-white">{selected.subject}</dd></div>}
              <div className="flex gap-3"><dt className="font-medium text-gray-500 w-20">Date:</dt><dd className="text-gray-500">{formatDate(selected.created_at)}</dd></div>
            </dl>
            <div className="border-t border-gray-100 dark:border-white/10 pt-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="danger" onClick={() => handleDelete(selected.id)}>
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
              <a href={`mailto:${selected.email}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all">
                <Mail className="w-4 h-4" /> Reply via Email
              </a>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
