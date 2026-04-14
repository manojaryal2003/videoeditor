import { FiYoutube, FiInstagram, FiLinkedin, FiTwitter, FiFacebook, FiArrowUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

const socialIcons = {
  youtube: FiYoutube,
  instagram: FiInstagram,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  facebook: FiFacebook,
};

export default function Footer({ about }) {
  const socials = about?.socialLinks || {};

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-dark-800 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-3 gradient-text">MIRAJ ARYAL</h3>
            <p className="text-sm leading-relaxed">
              Professional video editor crafting cinematic stories that captivate audiences and elevate brands.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['About', 'Services', 'Portfolio', 'Tools', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
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
                    whileHover={{ scale: 1.15, color: '#e51515' }}
                    className="p-2.5 rounded-xl bg-dark-700 text-gray-400 hover:text-primary hover:bg-dark-600 transition-all"
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-dark-600 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} All rights reserved. Built with passion.</p>
          <motion.button
            onClick={scrollTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-primary text-white hover:bg-primary-700 transition-all"
          >
            <FiArrowUp size={18} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
