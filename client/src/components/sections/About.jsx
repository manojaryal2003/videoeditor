import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiMapPin, FiCalendar, FiCheck } from 'react-icons/fi';
import api from '../../utils/api';
import SectionTitle from '../ui/SectionTitle';

export default function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    api.get('/about').then(({ data }) => setAbout(data.data)).catch(() => {});
  }, []);

  return (
    <section id="about" className="section-padding bg-gray-50 dark:bg-dark-800">
      <div className="container-max">
        <SectionTitle label="About Me" title="Who I Am" subtitle="A passionate storyteller through the lens of video editing" />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Decorative border */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/30 blur-xl" />
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary to-accent" />
              <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden">
                {about?.photoUrl ? (
                  <img
                    src={about.photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-dark-700 to-dark-600 flex items-center justify-center">
                    <span className="font-display text-6xl font-bold gradient-text">VE</span>
                  </div>
                )}
              </div>

              {/* Experience Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -bottom-5 -right-5 bg-white dark:bg-dark-700 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-dark-500"
              >
                <p className="text-3xl font-bold gradient-text">{about?.yearsExperience || '5'}+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Years Experience</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {about?.tagline && (
              <p className="text-primary font-semibold text-lg mb-3">{about.tagline}</p>
            )}

            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              {about?.bio || 'Professional video editor with years of experience creating stunning visual content for brands, artists, and content creators worldwide.'}
            </p>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
              {about?.location && (
                <span className="flex items-center gap-2">
                  <FiMapPin className="text-primary" /> {about.location}
                </span>
              )}
              {about?.yearsExperience && (
                <span className="flex items-center gap-2">
                  <FiCalendar className="text-primary" /> {about.yearsExperience}+ Years
                </span>
              )}
            </div>

            {/* Skills */}
            {about?.skills?.length > 0 && (
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Core Skills</h4>
                <div className="grid grid-cols-2 gap-2">
                  {about.skills.map((skill, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <FiCheck className="text-primary shrink-0" />
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {about?.resumeUrl && (
                <a
                  href={about.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <FiDownload size={16} />
                  Download CV
                </a>
              )}
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-outline"
              >
                Get In Touch
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
