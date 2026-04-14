import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import api from '../../utils/api';
import SectionTitle from '../ui/SectionTitle';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/projects?featured=true')
      .then(({ data }) => setProjects(data.data?.slice(0, 3) || []))
      .catch(() => {});
  }, []);

  if (!projects.length) return null;

  return (
    <section className="section-padding bg-gray-50 dark:bg-dark-800">
      <div className="container-max">
        <SectionTitle
          label="Featured"
          title="Best Projects"
          subtitle="Handpicked showcase of my most impactful work"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Featured */}
          {projects[0] && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] lg:row-span-2"
            >
              <div className="absolute inset-0 bg-dark-900">
                {projects[0].thumbnailUrl || projects[0].mediaType === 'image' ? (
                  <img
                    src={projects[0].thumbnailUrl || projects[0].mediaUrl}
                    alt={projects[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                ) : null}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold mb-3">
                  <FiStar size={10} /> Featured
                </span>
                <h3 className="font-display text-2xl font-bold text-white mb-2">{projects[0].title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{projects[0].description}</p>
                {projects[0].externalLink && (
                  <a
                    href={projects[0].externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                  >
                    Watch Project <FiArrowRight size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          )}

          {/* Secondary Featured */}
          {projects.slice(1).map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="group relative rounded-2xl overflow-hidden aspect-video"
            >
              <div className="absolute inset-0 bg-dark-900">
                {(project.thumbnailUrl || project.mediaType === 'image') && (
                  <img
                    src={project.thumbnailUrl || project.mediaUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-semibold text-white text-lg mb-1">{project.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-1">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline"
          >
            View All Projects <FiArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
