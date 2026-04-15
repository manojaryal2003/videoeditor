import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import SectionTitle from '../ui/SectionTitle';

const defaultTools = [
  { _id: '1', name: 'Adobe Premiere Pro', category: 'Editing', iconUrl: '' },
  { _id: '2', name: 'Adobe After Effects', category: 'Motion', iconUrl: '' },
  { _id: '3', name: 'DaVinci Resolve', category: 'Color', iconUrl: '' },
  { _id: '4', name: 'Final Cut Pro', category: 'Editing', iconUrl: '' },
  { _id: '5', name: 'Blender', category: '3D', iconUrl: '' },
  { _id: '6', name: 'Adobe Audition', category: 'Audio', iconUrl: '' },
  { _id: '7', name: 'Photoshop', category: 'Design', iconUrl: '' },
  { _id: '8', name: 'Lightroom', category: 'Photo', iconUrl: '' },
];

const categoryColors = {
  Editing: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
  Motion: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
  Color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
  '3D': 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
  Audio: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400',
  Design: 'from-primary/20 to-primary/10 border-primary/30 text-primary',
  Photo: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
};

const getInitials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export default function Tools() {
  const [tools, setTools] = useState(null);

  useEffect(() => {
    api.get('/tools')
      .then(({ data }) => setTools(data.data ?? []))
      .catch(() => setTools([]));
  }, []);

  if (!tools?.length) return null;

  const displayTools = tools;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="tools" className="section-padding bg-white dark:bg-dark-800">
      <div className="container-max">
        <SectionTitle
          label="Tech Stack"
          title="Tools & Software"
          subtitle="Industry-leading tools I use to craft cinematic masterpieces"
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
        >
          {displayTools.map((tool) => {
            const colorClass = categoryColors[tool.category] || 'from-gray-500/20 to-gray-600/10 border-gray-500/30 text-gray-400';
            return (
              <motion.div
                key={tool._id}
                variants={item}
                whileHover={{ scale: 1.06, y: -4 }}
                className={`group relative p-6 rounded-2xl border bg-gradient-to-br ${colorClass} transition-all duration-300 text-center cursor-default overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/5" />
                <div className="relative z-10">
                  {tool.iconUrl ? (
                    <img src={tool.iconUrl} alt={tool.name} className="w-12 h-12 object-contain mx-auto mb-3" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center mx-auto mb-3 text-current font-bold text-sm">
                      {getInitials(tool.name)}
                    </div>
                  )}
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{tool.name}</h4>
                  {tool.category && (
                    <p className="text-xs mt-1 opacity-60">{tool.category}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
