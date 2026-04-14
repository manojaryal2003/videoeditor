import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Modal from '../../components/ui/Modal';

const emptyForm = { name: '', category: 'Editing', iconUrl: '', iconPublicId: '', order: 0 };

export default function ManageTools() {
  const [tools, setTools] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const load = () => api.get('/tools').then(({ data }) => setTools(data.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const openEdit = (t) => { setEditing(t._id); setForm({ name: t.name, category: t.category, iconUrl: t.iconUrl, iconPublicId: t.iconPublicId, order: t.order }); setIconPreview(t.iconUrl || ''); setIconFile(null); setModal(true); };
  const openAdd = () => { setEditing(null); setForm(emptyForm); setIconPreview(''); setIconFile(null); setModal(true); };

  const handleIconSelect = (e) => {
    const file = e.target.files[0];
    if (file) { setIconFile(file); setIconPreview(URL.createObjectURL(file)); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalForm = { ...form };
      if (iconFile) {
        const fd = new FormData();
        fd.append('icon', iconFile);
        const { data } = await api.post('/tools/upload-icon', fd);
        finalForm.iconUrl = data.data.url;
        finalForm.iconPublicId = data.data.publicId;
        setIconFile(null);
      }
      if (editing) await api.put(`/tools/${editing}`, finalForm);
      else await api.post('/tools', finalForm);
      toast.success(editing ? 'Updated!' : 'Added!');
      setModal(false);
      load();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete tool?')) return;
    try { await api.delete(`/tools/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Tools & Software</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your tech stack</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><FiPlus size={16} /> Add Tool</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tools.map((tool) => (
          <motion.div key={tool._id} layout className="p-4 rounded-2xl bg-dark-700 border border-white/5 text-center relative group">
            {tool.iconUrl ? (
              <img src={tool.iconUrl} alt={tool.name} className="w-10 h-10 object-contain mx-auto mb-2" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mx-auto mb-2">
                {tool.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <p className="text-xs text-white font-medium truncate">{tool.name}</p>
            <p className="text-xs text-gray-500">{tool.category}</p>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(tool)} className="p-1 rounded-md hover:bg-primary/20 text-gray-500 hover:text-primary"><FiEdit2 size={12} /></button>
              <button onClick={() => handleDelete(tool._id)} className="p-1 rounded-md hover:bg-red-500/20 text-gray-500 hover:text-red-400"><FiTrash2 size={12} /></button>
            </div>
          </motion.div>
        ))}
        {tools.length === 0 && <div className="col-span-6 text-center py-16 text-gray-500">No tools yet.</div>}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Tool' : 'Add Tool'}>
        <div className="space-y-4">
          <div>
            <label className="admin-label">Tool Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Adobe Premiere Pro" className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Category</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="admin-input">
              {['Editing', 'Motion', 'Color', '3D', 'Audio', 'Design', 'Photo'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Icon / Logo</label>
            <div onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-white/10 hover:border-primary/50 rounded-xl p-4 cursor-pointer text-center">
              {iconPreview ? <img src={iconPreview} alt="icon" className="w-16 h-16 object-contain mx-auto" /> : <p className="text-gray-500 text-sm py-4">Click to upload icon</p>}
            </div>
            <input type="file" ref={fileRef} accept="image/*,image/svg+xml" onChange={handleIconSelect} className="hidden" />
          </div>
          <div>
            <label className="admin-label">Order</label>
            <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))} className="admin-input" />
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
            <FiSave size={16} /> {saving ? 'Saving...' : 'Save Tool'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
