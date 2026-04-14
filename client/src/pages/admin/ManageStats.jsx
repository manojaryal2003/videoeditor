import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Modal from '../../components/ui/Modal';

const emptyForm = { label: '', value: '', suffix: '+', icon: 'FiStar', order: 0 };
const iconOptions = ['FiFilm', 'FiUsers', 'FiGlobe', 'FiStar', 'FiAward', 'FiTrendingUp', 'FiHeart', 'FiDollarSign'];

export default function ManageStats() {
  const [stats, setStats] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/stats').then(({ data }) => setStats(data.data || [])).catch(() => {});

  useEffect(() => { load(); }, []);

  const openEdit = (stat) => { setEditing(stat._id); setForm({ label: stat.label, value: stat.value, suffix: stat.suffix, icon: stat.icon, order: stat.order }); setModal(true); };
  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) await api.put(`/stats/${editing}`, form);
      else await api.post('/stats', form);
      toast.success(editing ? 'Stat updated!' : 'Stat added!');
      setModal(false);
      load();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this stat?')) return;
    try { await api.delete(`/stats/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Statistics</h2>
          <p className="text-gray-400 text-sm mt-1">Manage achievement counters</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><FiPlus size={16} /> Add Stat</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-6 rounded-2xl bg-dark-700 border border-white/5 relative group">
            <div className="text-3xl font-bold text-white mb-1">{stat.value}<span className="text-primary">{stat.suffix}</span></div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(stat)} className="p-1.5 rounded-lg bg-dark-600 hover:bg-primary/20 text-gray-400 hover:text-primary transition-all"><FiEdit2 size={14} /></button>
              <button onClick={() => handleDelete(stat._id)} className="p-1.5 rounded-lg bg-dark-600 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"><FiTrash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
        {stats.length === 0 && (
          <div className="col-span-4 text-center py-16 text-gray-500">
            <p>No stats yet. <button onClick={openAdd} className="text-primary hover:underline">Add your first stat</button></p>
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Stat' : 'Add Stat'}>
        <div className="space-y-4">
          {[
            { key: 'label', label: 'Label', placeholder: 'Projects Completed' },
            { key: 'value', label: 'Value', placeholder: '200', type: 'number' },
            { key: 'suffix', label: 'Suffix', placeholder: '+' },
            { key: 'order', label: 'Order', placeholder: '0', type: 'number' },
          ].map(({ key, label, placeholder, type = 'text' }) => (
            <div key={key}>
              <label className="admin-label">{label}</label>
              <input type={type} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder} className="admin-input" />
            </div>
          ))}
          <div>
            <label className="admin-label">Icon</label>
            <select value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} className="admin-input">
              {iconOptions.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
            <FiSave size={16} /> {saving ? 'Saving...' : 'Save Stat'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
