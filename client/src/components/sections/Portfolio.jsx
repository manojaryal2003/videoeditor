import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import SectionTitle from '../ui/SectionTitle';
import ProjectCard from './ProjectCard';
import Loader from '../ui/Loader';

const filters = ['All', 'Videos', 'Shorts', 'Thumbnails', 'Banners'];

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    api.get('/projects')
      .then(({ data }) => setProjects(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="section-padding bg-dark-900">
      <div className="container-max">
        <SectionTitle
          label="My Work"
          title="Portfolio"
          subtitle="A curated collection of my finest video editing projects"
          light
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {filters.map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 border border-white/5'
              }`}
            >
              {filter}
              {activeFilter === filter && (
                <motion.span
                  layoutId="activeFilter"
                  className="absolute inset-0 rounded-xl bg-primary -z-10"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-gray-500"
          >
            <p className="text-lg">No projects in this category yet.</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
