import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Modal from '../../components/ui/Modal';

const emptyForm = { tier: 'Basic', title: '', price: '', description: '', deliveryTime: '', features: [], isPopular: false, order: 0 };

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [featureInput, setFeatureInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/services').then(({ data }) => setServices(data.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const openEdit = (s) => {
    setEditing(s._id);
    setForm({ tier: s.tier, title: s.title, price: s.price, description: s.description, deliveryTime: s.deliveryTime, features: [...s.features], isPopular: s.isPopular, order: s.order });
    setModal(true);
  };
  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true); };

  const addFeature = () => {
    if (featureInput.trim()) { setForm((f) => ({ ...f, features: [...f.features, featureInput.trim()] })); setFeatureInput(''); }
  };
  const removeFeature = (i) => setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) await api.put(`/services/${editing}`, form);
      else await api.post('/services', form);
      toast.success(editing ? 'Updated!' : 'Created!');
      setModal(false);
      load();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try { await api.delete(`/services/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const tierColors = { Basic: 'border-blue-500/30', High: 'border-primary/40', Advanced: 'border-purple-500/30' };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Services</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your service packages</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><FiPlus size={16} /> Add Service</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s) => (
          <motion.div key={s._id} layout className={`p-6 rounded-2xl bg-dark-700 border-2 ${tierColors[s.tier] || 'border-white/5'} relative group`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{s.tier}</span>
                {s.isPopular && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">Popular</span>}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-primary/20 text-gray-400 hover:text-primary"><FiEdit2 size={14} /></button>
                <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400"><FiTrash2 size={14} /></button>
              </div>
            </div>
            <h3 className="font-bold text-white text-lg">{s.title}</h3>
            <p className="text-2xl font-bold text-primary mt-1">{s.price}</p>
            {s.deliveryTime && <p className="text-xs text-gray-500 mt-1">Delivery: {s.deliveryTime}</p>}
            <ul className="mt-3 space-y-1">
              {s.features?.slice(0, 4).map((f, i) => <li key={i} className="text-xs text-gray-400">• {f}</li>)}
              {s.features?.length > 4 && <li className="text-xs text-gray-500">+{s.features.length - 4} more</li>}
            </ul>
          </motion.div>
        ))}
        {services.length === 0 && <div className="col-span-3 text-center py-16 text-gray-500">No services yet.</div>}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Service' : 'Add Service'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Tier</label>
              <select value={form.tier} onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value }))} className="admin-input">
                {['Basic', 'High', 'Advanced'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Price</label>
              <input type="text" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="$99" className="admin-input" />
            </div>
          </div>
          {[
            { key: 'title', label: 'Package Title', placeholder: 'Basic Edit' },
            { key: 'description', label: 'Description', placeholder: 'Perfect for...' },
            { key: 'deliveryTime', label: 'Delivery Time', placeholder: '3 days' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="admin-label">{label}</label>
              <input type="text" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="admin-input" />
            </div>
          ))}
          <div>
            <label className="admin-label">Features</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addFeature()} placeholder="Add feature..." className="admin-input flex-1" />
              <button onClick={addFeature} className="btn-primary px-3"><FiPlus size={14} /></button>
            </div>
            <div className="space-y-1">
              {form.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-600 text-sm text-gray-300">
                  <span className="flex-1">{f}</span>
                  <button onClick={() => removeFeature(i)} className="text-gray-500 hover:text-red-400"><FiX size={14} /></button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="popular" checked={form.isPopular} onChange={(e) => setForm((f) => ({ ...f, isPopular: e.target.checked }))} className="w-4 h-4 accent-primary" />
            <label htmlFor="popular" className="text-sm text-gray-300">Mark as Most Popular</label>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
            <FiSave size={16} /> {saving ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
