import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiFilm, FiUsers, FiGlobe, FiStar, FiAward, FiTrendingUp } from 'react-icons/fi';
import api from '../../utils/api';

function useCountUp(end, duration = 2500, decimals = 0, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(parseFloat(start.toFixed(decimals)));
    }, 16);
    return () => clearInterval(timer);
  }, [active, end, duration, decimals]);
  return count;
}

const iconMap = {
  FiFilm, FiUsers, FiGlobe, FiStar, FiAward, FiTrendingUp,
};

const defaultStats = [
  { label: 'Projects Completed', value: 200, suffix: '+', icon: 'FiFilm' },
  { label: 'Happy Clients', value: 50, suffix: '+', icon: 'FiUsers' },
  { label: 'Countries Served', value: 15, suffix: '+', icon: 'FiGlobe' },
  { label: 'Client Rating', value: 4.9, suffix: '★', icon: 'FiStar' },
];

function StatCard({ stat, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const Icon = iconMap[stat.icon] || FiStar;
  const decimals = stat.value % 1 !== 0 ? 1 : 0;
  const count = useCountUp(stat.value, 2500, decimals, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group text-center"
    >
      <div className="relative p-8 rounded-2xl bg-dark-700/50 border border-white/5 hover:border-primary/30 transition-all duration-300 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <Icon size={28} />
          </div>

          <div className="text-5xl font-bold text-white mb-2 font-display">
            {inView ? count.toFixed(decimals) : '0'}
            <span className="text-primary ml-1">{stat.suffix}</span>
          </div>

          <p className="text-gray-400 font-medium">{stat.label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Stats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api.get('/stats')
      .then(({ data }) => setStats(data.data?.length ? data.data : defaultStats))
      .catch(() => setStats(defaultStats));
  }, []);

  const displayStats = stats.length ? stats : defaultStats;

  return (
    <section className="section-padding bg-dark-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />

      <div className="container-max relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/10 text-primary mb-4">
            Achievements
          </span>
          <h2 className="section-title text-white">Numbers That Speak</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className={`grid gap-6 ${displayStats.length <= 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' : displayStats.length === 3 ? 'grid-cols-1 sm:grid-cols-3 max-w-3xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {displayStats.map((stat, i) => (
            <StatCard key={stat._id || i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
