import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiFilm, FiUsers, FiMail, FiPackage, FiTool, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { admin } = useAuth();
  const [counts, setCounts] = useState({ projects: 0, contacts: 0, unread: 0, services: 0, tools: 0, testimonials: 0 });

  useEffect(() => {
    Promise.allSettled([
      api.get('/projects/admin/all'),
      api.get('/contact'),
      api.get('/services'),
      api.get('/tools'),
      api.get('/testimonials'),
    ]).then(([projects, contacts, services, tools, testimonials]) => {
      setCounts({
        projects: projects.value?.data?.data?.length || 0,
        contacts: contacts.value?.data?.data?.length || 0,
        unread: contacts.value?.data?.data?.filter((c) => !c.isRead)?.length || 0,
        services: services.value?.data?.data?.length || 0,
        tools: tools.value?.data?.data?.length || 0,
        testimonials: testimonials.value?.data?.data?.length || 0,
      });
    });
  }, []);

  const cards = [
    { label: 'Total Projects', value: counts.projects, icon: FiFilm, color: 'from-blue-500 to-blue-600', to: '/admin/projects' },
    { label: 'Messages', value: counts.contacts, icon: FiMail, color: 'from-primary to-red-600', to: '/admin/contacts', badge: counts.unread },
    { label: 'Services', value: counts.services, icon: FiPackage, color: 'from-green-500 to-green-600', to: '/admin/services' },
    { label: 'Tools', value: counts.tools, icon: FiTool, color: 'from-purple-500 to-purple-600', to: '/admin/tools' },
    { label: 'Testimonials', value: counts.testimonials, icon: FiStar, color: 'from-amber-500 to-amber-600', to: '/admin/testimonials' },
  ];

  const quickLinks = [
    { label: 'Edit Hero', to: '/admin/hero', desc: 'Update intro video & text' },
    { label: 'Add Project', to: '/admin/projects', desc: 'Upload new portfolio work' },
    { label: 'View Messages', to: '/admin/contacts', desc: `${counts.unread} unread messages` },
    { label: 'Update About', to: '/admin/about', desc: 'Edit bio & profile photo' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white font-display">
          Welcome back, {admin?.username}!
        </h2>
        <p className="text-gray-400 mt-1">Here's an overview of your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, color, to, badge }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link to={to} className="block group">
              <div className="p-5 rounded-2xl bg-dark-700 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  {badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold">
                      {badge} new
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-white font-display">{value}</p>
                <p className="text-sm text-gray-400 mt-1">{label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map(({ label, to, desc }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
          >
            <Link
              to={to}
              className="block p-5 rounded-2xl bg-dark-700 border border-white/5 hover:border-primary/30 hover:bg-dark-600 transition-all group"
            >
              <h4 className="font-semibold text-white group-hover:text-primary transition-colors mb-1">{label}</h4>
              <p className="text-sm text-gray-500">{desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
