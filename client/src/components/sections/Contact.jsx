import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMail, FiUser, FiMessageSquare, FiYoutube, FiInstagram, FiLinkedin, FiTwitter, FiFacebook } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import SectionTitle from '../ui/SectionTitle';

const socialIcons = { youtube: FiYoutube, instagram: FiInstagram, linkedin: FiLinkedin, twitter: FiTwitter, facebook: FiFacebook };

export default function Contact() {
  const [about, setAbout] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/about').then(({ data }) => setAbout(data.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent! I\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const socials = about?.socialLinks || {};

  return (
    <section id="contact" className="section-padding bg-gray-50 dark:bg-dark-800">
      <div className="container-max">
        <SectionTitle
          label="Get In Touch"
          title="Contact Me"
          subtitle="Have a project in mind? Let's create something amazing together"
        />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-accent text-white mb-6">
              <h3 className="font-display text-2xl font-bold mb-3">Let's Work Together</h3>
              <p className="opacity-90 leading-relaxed">
                I'm available for freelance projects, collaborations, and full-time opportunities.
                Reach out and let's discuss how I can bring your vision to life.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                { icon: FiMail, label: 'Email', value: about?.email || 'hello@videoeditor.com' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-dark-700 border border-gray-100 dark:border-dark-500 shadow-sm">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Me</h4>
              <div className="flex gap-3 flex-wrap">
                {Object.entries(socials).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = socialIcons[platform];
                  if (!Icon) return null;
                  return (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.15, y: -2 }}
                      className="p-3 rounded-xl bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-500 text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white dark:bg-dark-700 shadow-xl border border-gray-100 dark:border-dark-500 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="admin-label">
                    <FiUser size={14} className="inline mr-1.5" /> Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">
                    <FiMail size={14} className="inline mr-1.5" /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Project inquiry"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">
                  <FiMessageSquare size={14} className="inline mr-1.5" /> Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="admin-input resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiSend size={18} />
                )}
                {loading ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
