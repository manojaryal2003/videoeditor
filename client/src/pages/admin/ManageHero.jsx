import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiSave, FiVideo, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function ManageHero() {
  const [form, setForm] = useState({ greeting: '', name: '', typingWords: [], subheading: '', ctaLabel: '', hireMeLabel: '' });
  const [wordInput, setWordInput] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    api.get('/hero').then(({ data }) => {
      const h = data.data;
      setForm({ greeting: h.greeting || '', name: h.name || '', typingWords: h.typingWords || [], subheading: h.subheading || '', ctaLabel: h.ctaLabel || '', hireMeLabel: h.hireMeLabel || '' });
      setVideoPreview(h.videoUrl || '');
    }).catch(() => {});
  }, []);

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('video', videoFile);
    try {
      await api.post('/hero/upload-video', fd);
      toast.success('Video uploaded!');
      setVideoFile(null);
    } catch { toast.error('Video upload failed'); }
    finally { setUploading(false); }
  };

  const addWord = () => {
    if (wordInput.trim()) {
      setForm((f) => ({ ...f, typingWords: [...f.typingWords, wordInput.trim()] }));
      setWordInput('');
    }
  };

  const removeWord = (i) => setForm((f) => ({ ...f, typingWords: f.typingWords.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (videoFile) await uploadVideo();
      await api.put('/hero', form);
      toast.success('Hero section saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Hero Section</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your intro video and text</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} onClick={handleSave} disabled={saving}
          className="btn-primary disabled:opacity-60">
          <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Text Settings */}
        <div className="p-6 rounded-2xl bg-dark-700 border border-white/5 space-y-5">
          <h3 className="font-semibold text-white mb-4">Text Content</h3>
          {[
            { key: 'greeting', label: 'Greeting (e.g. "Hello, I\'m")', placeholder: "Hello, I'm" },
            { key: 'name', label: 'Your Name', placeholder: 'John Doe' },
            { key: 'subheading', label: 'Subheading / Tagline', placeholder: 'Professional Video Editor' },
            { key: 'ctaLabel', label: 'Primary Button Text', placeholder: 'View My Work' },
            { key: 'hireMeLabel', label: 'Secondary Button Text', placeholder: 'Hire Me' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="admin-label">{label}</label>
              <input type="text" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder} className="admin-input" />
            </div>
          ))}

          {/* Typing Words */}
          <div>
            <label className="admin-label">Typing Animation Words</label>
            <div className="flex gap-2 mb-3">
              <input type="text" value={wordInput} onChange={(e) => setWordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addWord()}
                placeholder="e.g. Video Editor" className="admin-input flex-1" />
              <button onClick={addWord} className="btn-primary px-4 py-2"><FiPlus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.typingWords.map((word, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm">
                  {word}
                  <button onClick={() => removeWord(i)} className="hover:text-red-400 transition-colors"><FiX size={12} /></button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Video Upload */}
        <div className="p-6 rounded-2xl bg-dark-700 border border-white/5">
          <h3 className="font-semibold text-white mb-4">Intro Video</h3>
          <div
            onClick={() => fileRef.current.click()}
            className="border-2 border-dashed border-white/10 hover:border-primary/50 rounded-xl p-6 text-center cursor-pointer transition-all group mb-4"
          >
            {videoPreview ? (
              <video src={videoPreview} className="w-full rounded-lg max-h-48 object-cover" muted loop autoPlay />
            ) : (
              <div className="py-8">
                <FiVideo size={40} className="mx-auto text-gray-600 group-hover:text-primary transition-colors mb-3" />
                <p className="text-gray-400 text-sm">Click to upload intro video</p>
                <p className="text-gray-600 text-xs mt-1">MP4, MOV up to 200MB</p>
              </div>
            )}
          </div>
          <input type="file" ref={fileRef} accept="video/*" onChange={handleVideoSelect} className="hidden" />
          {videoFile && (
            <motion.button whileHover={{ scale: 1.02 }} onClick={uploadVideo} disabled={uploading}
              className="btn-primary w-full justify-center disabled:opacity-60">
              <FiUpload size={16} /> {uploading ? 'Uploading...' : 'Upload Video to Cloud'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
