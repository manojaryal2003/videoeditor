import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiStar, FiUpload, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';

const emptyForm = { title: '', description: '', category: 'Videos', mediaUrl: '', mediaPublicId: '', mediaType: 'video', thumbnailUrl: '', thumbnailPublicId: '', clientName: '', externalLink: '', isFeatured: false, isPublished: true, order: 0 };

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const mediaRef = useRef();
  const thumbRef = useRef();

  const load = () => {
    api.get('/projects/admin/all').then(({ data }) => setProjects(data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ title: p.title, description: p.description, category: p.category, mediaUrl: p.mediaUrl, mediaPublicId: p.mediaPublicId, mediaType: p.mediaType, thumbnailUrl: p.thumbnailUrl, thumbnailPublicId: p.thumbnailPublicId, clientName: p.clientName, externalLink: p.externalLink, isFeatured: p.isFeatured, isPublished: p.isPublished, order: p.order });
    setMediaPreview(p.mediaUrl || '');
    setThumbPreview(p.thumbnailUrl || '');
    setMediaFile(null); setThumbFile(null);
    setModal(true);
  };
  const openAdd = () => { setEditing(null); setForm(emptyForm); setMediaPreview(''); setThumbPreview(''); setMediaFile(null); setThumbFile(null); setModal(true); };

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setForm((f) => ({ ...f, mediaType: file.type.startsWith('video') ? 'video' : 'image' }));
  };

  const uploadMedia = async () => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('media', mediaFile);
      const { data } = await api.post('/projects/upload-media', fd);
      setForm((f) => ({ ...f, mediaUrl: data.data.url, mediaPublicId: data.data.publicId, mediaType: data.data.mediaType }));
      setMediaFile(null);
      toast.success('Media uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const uploadThumbnail = async () => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('media', thumbFile);
      const { data } = await api.post('/projects/upload-media', fd);
      setForm((f) => ({ ...f, thumbnailUrl: data.data.url, thumbnailPublicId: data.data.publicId }));
      setThumbFile(null);
      toast.success('Thumbnail uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.mediaUrl) return toast.error('Please upload media first');
    setSaving(true);
    try {
      if (editing) await api.put(`/projects/${editing}`, form);
      else await api.post('/projects', form);
      toast.success(editing ? 'Updated!' : 'Created!');
      setModal(false);
      load();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project? This will also delete media from Cloudinary.')) return;
    try { await api.delete(`/projects/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const toggleFeatured = async (p) => {
    try { await api.put(`/projects/${p._id}`, { isFeatured: !p.isFeatured }); load(); }
    catch { toast.error('Failed to update'); }
  };
  const togglePublished = async (p) => {
    try { await api.put(`/projects/${p._id}`, { isPublished: !p.isPublished }); load(); }
    catch { toast.error('Failed to update'); }
  };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Projects</h2>
          <p className="text-gray-400 text-sm mt-1">{projects.length} total projects</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><FiPlus size={16} /> Add Project</button>
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((p) => (
            <motion.div key={p._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl bg-dark-700 border border-white/5 overflow-hidden group relative">
              <div className="aspect-video bg-dark-800 relative overflow-hidden">
                {(p.thumbnailUrl || p.mediaType === 'image') ? (
                  <img src={p.thumbnailUrl || p.mediaUrl} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No thumbnail</div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-xs">{p.category}</span>
                  {p.isFeatured && <span className="px-2 py-0.5 rounded-md bg-primary text-white text-xs">Featured</span>}
                  {!p.isPublished && <span className="px-2 py-0.5 rounded-md bg-gray-500 text-white text-xs">Hidden</span>}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white text-sm mb-3 truncate">{p.title}</h4>
                <div className="flex items-center gap-1 justify-end flex-wrap">
                  <button onClick={() => toggleFeatured(p)} title={p.isFeatured ? 'Unfeature' : 'Feature'}
                    className={`p-1.5 rounded-lg text-sm transition-all ${p.isFeatured ? 'text-amber-400 bg-amber-500/10' : 'text-gray-500 hover:text-amber-400 hover:bg-amber-500/10'}`}>
                    <FiStar size={14} />
                  </button>
                  <button onClick={() => togglePublished(p)} title={p.isPublished ? 'Hide' : 'Publish'}
                    className={`p-1.5 rounded-lg text-sm transition-all ${p.isPublished ? 'text-green-400 bg-green-500/10' : 'text-gray-500 hover:text-green-400 hover:bg-green-500/10'}`}>
                    {p.isPublished ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-all"><FiEdit2 size={14} /></button>
                  <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 size={14} /></button>
                </div>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && <div className="col-span-4 text-center py-16 text-gray-500">No projects yet.</div>}
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Project' : 'Add Project'} size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Media Upload */}
          <div className="space-y-4">
            <div>
              <label className="admin-label">Project Media (Video/Image)</label>
              <div onClick={() => mediaRef.current.click()}
                className="border-2 border-dashed border-white/10 hover:border-primary/50 rounded-xl p-4 cursor-pointer transition-all text-center min-h-[160px] flex items-center justify-center">
                {mediaPreview ? (
                  form.mediaType === 'video' ? (
                    <video src={mediaPreview} className="w-full max-h-40 rounded-lg" muted />
                  ) : (
                    <img src={mediaPreview} alt="preview" className="w-full max-h-40 rounded-lg object-cover" />
                  )
                ) : (
                  <div>
                    <FiUpload size={28} className="mx-auto text-gray-600 mb-2" />
                    <p className="text-sm text-gray-400">Click to select media</p>
                    <p className="text-xs text-gray-600 mt-1">Video or Image</p>
                  </div>
                )}
              </div>
              <input type="file" ref={mediaRef} accept="video/*,image/*" onChange={handleMediaSelect} className="hidden" />
              {mediaFile && (
                <button onClick={uploadMedia} disabled={uploading} className="btn-primary w-full justify-center text-sm disabled:opacity-60 mt-2">
                  <FiUpload size={14} /> {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
                </button>
              )}
              {form.mediaUrl && !mediaFile && <p className="text-xs text-green-400 mt-1">✓ Media uploaded</p>}
            </div>

            {form.mediaType === 'video' && (
              <div>
                <label className="admin-label">Thumbnail (for video)</label>
                <div onClick={() => thumbRef.current.click()}
                  className="border-2 border-dashed border-white/10 hover:border-primary/50 rounded-xl p-4 cursor-pointer transition-all text-center min-h-[100px] flex items-center justify-center">
                  {thumbPreview ? (
                    <img src={thumbPreview} alt="thumb" className="w-full max-h-24 rounded-lg object-cover" />
                  ) : (
                    <p className="text-sm text-gray-500">Click to add thumbnail</p>
                  )}
                </div>
                <input type="file" ref={thumbRef} accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { setThumbFile(f); setThumbPreview(URL.createObjectURL(f)); } }} className="hidden" />
                {thumbFile && (
                  <button onClick={uploadThumbnail} disabled={uploading} className="btn-primary w-full justify-center text-sm mt-2 disabled:opacity-60">
                    <FiUpload size={14} /> Upload Thumbnail
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <label className="admin-label">Title</label>
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Project title" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="admin-input">
                {['Videos', 'Shorts', 'Thumbnails', 'Banners'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Description</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
                rows={3} placeholder="Describe the project..." className="admin-input resize-none" />
            </div>
            <div>
              <label className="admin-label">Client Name (optional)</label>
              <input type="text" value={form.clientName} onChange={(e) => set('clientName', e.target.value)} placeholder="Client name" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">External Link (YouTube/Vimeo)</label>
              <input type="url" value={form.externalLink} onChange={(e) => set('externalLink', e.target.value)} placeholder="https://..." className="admin-input" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-sm text-gray-300">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-sm text-gray-300">Published</span>
              </label>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-dark-500">
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
            <FiSave size={16} /> {saving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
