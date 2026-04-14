import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';
import api from '../../utils/api';
import SectionTitle from '../ui/SectionTitle';

const defaultTestimonials = [
  { _id: '1', clientName: 'Alex Johnson', clientRole: 'Content Creator', message: 'Absolutely stunning work! The editing transformed my raw footage into a cinematic masterpiece. My subscribers loved it.', rating: 5, avatarUrl: '' },
  { _id: '2', clientName: 'Sarah Williams', clientRole: 'Marketing Director', message: 'Professional, creative, and delivered on time. The color grading was exceptional and perfectly matched our brand identity.', rating: 5, avatarUrl: '' },
  { _id: '3', clientName: 'Mike Chen', clientRole: 'YouTuber', message: 'Working with this editor was a game-changer for my channel. The motion graphics added a whole new level of professionalism.', rating: 5, avatarUrl: '' },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={16}
          className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}
          style={{ fill: star <= rating ? 'currentColor' : 'none' }}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const autoRef = useRef(null);

  useEffect(() => {
    api.get('/testimonials')
      .then(({ data }) => setTestimonials(data.data?.length ? data.data : defaultTestimonials))
      .catch(() => setTestimonials(defaultTestimonials));
  }, []);

  const displayTestimonials = testimonials.length ? testimonials : defaultTestimonials;

  const next = () => setCurrent((c) => (c + 1) % displayTestimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + displayTestimonials.length) % displayTestimonials.length);

  useEffect(() => {
    autoRef.current = setInterval(next, 5000);
    return () => clearInterval(autoRef.current);
  }, [displayTestimonials.length]);

  const resetAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(next, 5000);
  };

  const handleNext = () => { next(); resetAuto(); };
  const handlePrev = () => { prev(); resetAuto(); };

  const t = displayTestimonials[current];

  return (
    <section id="testimonials" className="section-padding bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />

      <div className="container-max relative">
        <SectionTitle label="Testimonials" title="Client Reviews" subtitle="What clients say about working with me" light />

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.5 }}
                className="bg-dark-700/60 backdrop-blur-xl rounded-3xl p-10 md:p-14 border border-white/5 relative"
              >
                <FaQuoteLeft size={40} className="text-primary/30 mb-6" />

                <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8 italic">
                  "{t?.message}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                    {t?.avatarUrl ? (
                      <img src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {t?.clientName?.charAt(0) || 'C'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{t?.clientName}</h4>
                    {t?.clientRole && <p className="text-gray-400 text-sm">{t.clientRole}</p>}
                    <div className="mt-1">
                      <StarRating rating={t?.rating || 5} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-2">
                {displayTestimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrent(i); resetAuto(); }}
                    className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-dark-600 hover:bg-dark-500'}`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrev}
                  className="p-3 rounded-xl bg-dark-700 hover:bg-primary text-gray-400 hover:text-white border border-white/5 transition-all"
                >
                  <FiChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="p-3 rounded-xl bg-dark-700 hover:bg-primary text-gray-400 hover:text-white border border-white/5 transition-all"
                >
                  <FiChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
