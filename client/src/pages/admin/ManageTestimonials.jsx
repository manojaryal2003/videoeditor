import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiStar, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Modal from '../../components/ui/Modal';

const emptyForm = { clientName: '', clientRole: '', message: '', rating: 5, isPublished: true, order: 0 };

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const load = () => api.get('/testimonials').then(({ data }) => setTestimonials(data.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const openEdit = (t) => {
    setEditing(t._id);
    setForm({ clientName: t.clientName, clientRole: t.clientRole, message: t.message, rating: t.rating, isPublished: t.isPublished, order: t.order });
    setAvatarPreview(t.avatarUrl || ''); setAvatarFile(null); setModal(true);
  };
  const openAdd = () => { setEditing(null); setForm(emptyForm); setAvatarPreview(''); setAvatarFile(null); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      let extraFields = {};
      if (avatarFile) {
        const fd = new FormData();
        fd.append('avatar', avatarFile);
        const { data } = await api.post('/testimonials/upload-avatar', fd);
        extraFields = { avatarUrl: data.data.url, avatarPublicId: data.data.publicId };
        setAvatarFile(null);
      }
      const payload = { ...form, ...extraFields };
      if (editing) await api.put(`/testimonials/${editing}`, payload);
      else await api.post('/testimonials', payload);
      toast.success(editing ? 'Updated!' : 'Added!');
      setModal(false);
      load();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete testimonial?')) return;
    try { await api.delete(`/testimonials/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Failed'); }
  };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Testimonials</h2>
          <p className="text-gray-400 text-sm mt-1">Manage client reviews</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><FiPlus size={16} /> Add Review</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <motion.div key={t._id} layout className="p-5 rounded-2xl bg-dark-700 border border-white/5 relative group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                {t.avatarUrl ? <img src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover" /> : <span className="text-white font-bold text-sm">{t.clientName?.charAt(0)}</span>}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{t.clientName}</p>
                <p className="text-xs text-gray-500">{t.clientRole}</p>
              </div>
              <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-primary/20 text-gray-500 hover:text-primary"><FiEdit2 size={13} /></button>
                <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400"><FiTrash2 size={13} /></button>
              </div>
            </div>
            <div className="flex gap-0.5 mb-2">
              {[1,2,3,4,5].map((s) => <FiStar key={s} size={12} className={s <= t.rating ? 'text-amber-400' : 'text-gray-600'} />)}
            </div>
            <p className="text-gray-400 text-sm line-clamp-3 italic">"{t.message}"</p>
            {!t.isPublished && <span className="inline-block mt-2 text-xs text-gray-600">Hidden</span>}
          </motion.div>
        ))}
        {testimonials.length === 0 && <div className="col-span-3 text-center py-16 text-gray-500">No testimonials yet.</div>}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Review' : 'Add Review'}>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div onClick={() => fileRef.current.click()} className="w-16 h-16 rounded-full overflow-hidden bg-dark-600 cursor-pointer border-2 border-dashed border-white/20 hover:border-primary/50 flex items-center justify-center">
              {avatarPreview ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-gray-500 text-xs text-center">Photo</span>}
            </div>
            <input type="file" ref={fileRef} accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); } }} className="hidden" />
            <div className="flex-1 space-y-3">
              <div>
                <label className="admin-label">Client Name</label>
                <input type="text" value={form.clientName} onChange={(e) => set('clientName', e.target.value)} placeholder="John Doe" className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Client Role</label>
                <input type="text" value={form.clientRole} onChange={(e) => set('clientRole', e.target.value)} placeholder="Content Creator" className="admin-input" />
              </div>
            </div>
          </div>
          <div>
            <label className="admin-label">Review Message</label>
            <textarea value={form.message} onChange={(e) => set('message', e.target.value)} rows={4} placeholder="What the client said..." className="admin-input resize-none" />
          </div>
          <div>
            <label className="admin-label">Rating: {form.rating}/5</label>
            <div className="flex gap-2 mt-1">
              {[1,2,3,4,5].map((s) => (
                <button key={s} onClick={() => set('rating', s)}
                  className={`text-2xl transition-colors ${s <= form.rating ? 'text-amber-400' : 'text-gray-600 hover:text-amber-300'}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm text-gray-300">Published (visible on site)</span>
          </label>
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
            <FiSave size={16} /> {saving ? 'Saving...' : 'Save Review'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
