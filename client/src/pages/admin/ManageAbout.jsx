import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiUpload, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const socialPlatforms = ['youtube', 'instagram', 'linkedin', 'twitter', 'facebook', 'tiktok'];

export default function ManageAbout() {
  const [form, setForm] = useState({
    bio: '', tagline: '', location: '', yearsExperience: '', resumeUrl: '', whatsappNumber: '', skills: [],
    socialLinks: { youtube: '', instagram: '', linkedin: '', twitter: '', facebook: '', tiktok: '' },
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    api.get('/about').then(({ data }) => {
      const a = data.data;
      setForm({
        bio: a.bio || '', tagline: a.tagline || '', location: a.location || '',
        yearsExperience: a.yearsExperience || '', resumeUrl: a.resumeUrl || '',
        whatsappNumber: a.whatsappNumber || '', skills: a.skills || [],
        socialLinks: { youtube: a.socialLinks?.youtube || '', instagram: a.socialLinks?.instagram || '',
          linkedin: a.socialLinks?.linkedin || '', twitter: a.socialLinks?.twitter || '',
          facebook: a.socialLinks?.facebook || '', tiktok: a.socialLinks?.tiktok || '' },
      });
      setPhotoPreview(a.photoUrl || '');
    }).catch(() => {});
  }, []);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)); }
  };

  const addSkill = () => {
    if (skillInput.trim()) { setForm((f) => ({ ...f, skills: [...f.skills, skillInput.trim()] })); setSkillInput(''); }
  };
  const removeSkill = (i) => setForm((f) => ({ ...f, skills: f.skills.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (photoFile) {
        const fd = new FormData();
        fd.append('photo', photoFile);
        await api.post('/about/upload-photo', fd);
        setPhotoFile(null);
      }
      await api.put('/about', form);
      toast.success('About section saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setSocial = (key, val) => setForm((f) => ({ ...f, socialLinks: { ...f.socialLinks, [key]: val } }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">About Section</h2>
          <p className="text-gray-400 text-sm mt-1">Update your bio and profile photo</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
          <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Photo */}
        <div className="p-6 rounded-2xl bg-dark-700 border border-white/5">
          <h3 className="font-semibold text-white mb-4">Profile Photo</h3>
          <div onClick={() => fileRef.current.click()}
            className="border-2 border-dashed border-white/10 hover:border-primary/50 rounded-xl p-4 cursor-pointer transition-all group mb-4 text-center">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-40 h-40 rounded-full object-cover mx-auto" />
            ) : (
              <div className="py-8">
                <div className="w-20 h-20 rounded-full bg-dark-600 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-3xl font-bold gradient-text">?</span>
                </div>
                <p className="text-gray-400 text-sm">Click to upload photo</p>
              </div>
            )}
          </div>
          <input type="file" ref={fileRef} accept="image/*" onChange={handlePhotoSelect} className="hidden" />
          {photoFile && (
            <button onClick={async () => { const fd = new FormData(); fd.append('photo', photoFile); await api.post('/about/upload-photo', fd); toast.success('Photo uploaded!'); setPhotoFile(null); }}
              className="btn-primary w-full justify-center text-sm">
              <FiUpload size={14} /> Upload Photo
            </button>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-dark-700 border border-white/5 space-y-4">
            <h3 className="font-semibold text-white">Personal Info</h3>
            {[
              { key: 'tagline', label: 'Tagline', placeholder: 'Cinematic storyteller' },
              { key: 'location', label: 'Location', placeholder: 'New York, USA' },
              { key: 'yearsExperience', label: 'Years of Experience', placeholder: '5' },
              { key: 'resumeUrl', label: 'Resume/CV URL', placeholder: 'https://...' },
              { key: 'whatsappNumber', label: 'WhatsApp Number (with country code)', placeholder: '15551234567' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="admin-label">{label}</label>
                <input type="text" value={form[key]} onChange={(e) => set(key, e.target.value)}
                  placeholder={placeholder} className="admin-input" />
              </div>
            ))}
            <div>
              <label className="admin-label">Bio</label>
              <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)}
                rows={4} placeholder="Tell your story..." className="admin-input resize-none" />
            </div>
          </div>

          {/* Skills */}
          <div className="p-6 rounded-2xl bg-dark-700 border border-white/5">
            <h3 className="font-semibold text-white mb-4">Skills</h3>
            <div className="flex gap-2 mb-3">
              <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                placeholder="e.g. Color Grading" className="admin-input flex-1" />
              <button onClick={addSkill} className="btn-primary px-4"><FiPlus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm">
                  {skill}
                  <button onClick={() => removeSkill(i)}><FiX size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="p-6 rounded-2xl bg-dark-700 border border-white/5">
            <h3 className="font-semibold text-white mb-4">Social Media Links</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {socialPlatforms.map((platform) => (
                <div key={platform}>
                  <label className="admin-label capitalize">{platform}</label>
                  <input type="url" value={form.socialLinks[platform]}
                    onChange={(e) => setSocial(platform, e.target.value)}
                    placeholder={`https://${platform}.com/...`} className="admin-input" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
