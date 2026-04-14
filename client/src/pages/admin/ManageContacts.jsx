import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiTrash2, FiCheck, FiX, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';
import api from '../../utils/api';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';

export default function ManageContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = () => {
    api.get('/contact').then(({ data }) => setContacts(data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try { await api.put(`/contact/${id}/read`); load(); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try { await api.delete(`/contact/${id}`); toast.success('Deleted!'); setSelected(null); load(); }
    catch { toast.error('Failed'); }
  };

  const unread = contacts.filter((c) => !c.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Messages</h2>
          <p className="text-gray-400 text-sm mt-1">
            {contacts.length} total {unread > 0 && <span className="text-primary font-semibold">· {unread} unread</span>}
          </p>
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <motion.div
              key={c._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all group ${
                !c.isRead
                  ? 'bg-primary/5 border-primary/20 hover:border-primary/40'
                  : 'bg-dark-700 border-white/5 hover:border-white/10'
              }`}
              onClick={() => { setSelected(c); if (!c.isRead) markRead(c._id); }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!c.isRead ? 'bg-primary/20 text-primary' : 'bg-dark-600 text-gray-400'}`}>
                <FiMail size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-0.5">
                  <span className="font-semibold text-white text-sm">{c.name}</span>
                  {!c.isRead && <span className="w-2 h-2 bg-primary rounded-full" />}
                  <span className="text-gray-500 text-xs ml-auto">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-gray-400 text-xs mb-0.5">{c.email}</p>
                {c.subject && <p className="text-gray-300 text-sm font-medium truncate">{c.subject}</p>}
                <p className="text-gray-500 text-xs truncate">{c.message}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                {!c.isRead && (
                  <button onClick={(e) => { e.stopPropagation(); markRead(c._id); }}
                    className="p-1.5 rounded-lg hover:bg-green-500/20 text-gray-500 hover:text-green-400">
                    <FiCheck size={14} />
                  </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); handleDelete(c._id); }}
                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
          {contacts.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <FiMail size={40} className="mx-auto mb-3 opacity-30" />
              <p>No messages yet.</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Message Detail" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">From</p>
                <p className="text-white font-semibold">{selected.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Email</p>
                <a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a>
              </div>
              {selected.phone && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Phone</p>
                  <p className="text-white">{selected.phone}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500 text-xs mb-1">Date</p>
                <p className="text-white">{formatDate(selected.createdAt)}</p>
              </div>
            </div>
            {selected.subject && (
              <div>
                <p className="text-gray-500 text-xs mb-1">Subject</p>
                <p className="text-white font-semibold">{selected.subject}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500 text-xs mb-2">Message</p>
              <p className="text-gray-200 leading-relaxed bg-dark-800 rounded-xl p-4 text-sm whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="flex gap-3">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your inquiry'}`}
                className="btn-primary flex-1 justify-center text-sm">
                <FiMail size={14} /> Reply via Email
              </a>
              <button onClick={() => handleDelete(selected._id)}
                className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-all">
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
