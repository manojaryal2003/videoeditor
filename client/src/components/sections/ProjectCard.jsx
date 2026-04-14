import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiExternalLink, FiCalendar, FiImage, FiVideo } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';

export default function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  const isVideo = project.mediaType === 'video';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative rounded-2xl overflow-hidden bg-dark-700 border border-white/5 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Media */}
      <div className="relative aspect-video overflow-hidden bg-dark-800">
        {isVideo ? (
          <>
            {project.thumbnailUrl ? (
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-dark-800">
                <FiVideo size={40} className="text-gray-600" />
              </div>
            )}
            {/* Video preview on hover */}
            {hovered && project.mediaUrl && (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={project.mediaUrl} type="video/mp4" />
              </video>
            )}
          </>
        ) : (
          <img
            src={project.mediaUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}

        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: hovered ? 1 : 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-xl"
          >
            {isVideo ? <FiPlay size={24} className="text-white ml-1" /> : <FiImage size={24} className="text-white" />}
          </motion.div>
        </motion.div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-xs font-semibold text-white border border-white/10">
            {project.category}
          </span>
        </div>

        {/* Featured Badge */}
        {project.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-bold">Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-white text-lg mb-1.5 line-clamp-1">{project.title}</h3>
        {project.description && (
          <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">{project.description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <FiCalendar size={12} />
            {formatDate(project.createdAt)}
          </span>
          {project.externalLink && (
            <a
              href={project.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:text-primary-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink size={14} /> Watch
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
