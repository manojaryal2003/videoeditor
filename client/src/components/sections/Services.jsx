import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiStar, FiArrowRight } from 'react-icons/fi';
import api from '../../utils/api';
import SectionTitle from '../ui/SectionTitle';

const defaultServices = [
  {
    _id: '1', tier: 'Basic', title: 'Basic Edit', price: '$99', deliveryTime: '3 days',
    description: 'Perfect for simple video editing needs',
    features: ['Up to 5 min video', 'Basic cuts & transitions', 'Background music', '1 revision', 'HD delivery'],
    isPopular: false,
  },
  {
    _id: '2', tier: 'High', title: 'Pro Edit', price: '$249', deliveryTime: '5 days',
    description: 'Advanced editing for professional content',
    features: ['Up to 15 min video', 'Advanced transitions', 'Color grading', 'Sound design', 'Motion graphics', '3 revisions', '4K delivery'],
    isPopular: true,
  },
  {
    _id: '3', tier: 'Advanced', title: 'Cinematic', price: '$499', deliveryTime: '10 days',
    description: 'Full cinematic production experience',
    features: ['Unlimited duration', 'Cinematic color grade', 'VFX & compositing', 'Custom motion graphics', 'Sound design & mix', 'Unlimited revisions', '4K delivery', 'Priority support'],
    isPopular: false,
  },
];

const tierColors = {
  Basic: { gradient: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/20', accent: 'text-blue-500', badge: 'bg-blue-500/10 text-blue-400' },
  High: { gradient: 'from-primary/10 to-accent/5', border: 'border-primary/40', accent: 'text-primary', badge: 'bg-primary/10 text-primary' },
  Advanced: { gradient: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/20', accent: 'text-purple-500', badge: 'bg-purple-500/10 text-purple-400' },
};

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services')
      .then(({ data }) => setServices(data.data?.length ? data.data : defaultServices))
      .catch(() => setServices(defaultServices));
  }, []);

  const displayServices = services.length ? services : defaultServices;

  return (
    <section id="services" className="section-padding bg-white dark:bg-dark-800">
      <div className="container-max">
        <SectionTitle
          label="Pricing"
          title="Service Packages"
          subtitle="Choose the perfect package for your video editing needs"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {displayServices.map((service, i) => {
            const colors = tierColors[service.tier] || tierColors.Basic;
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className={`relative rounded-2xl border-2 ${colors.border} bg-gradient-to-br ${colors.gradient} p-8 transition-all duration-300 ${service.isPopular ? 'scale-105 shadow-2xl shadow-primary/20 dark:bg-dark-700' : 'dark:bg-dark-700'}`}
              >
                {service.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full shadow-lg">
                      <FiStar size={12} /> Most Popular
                    </span>
                  </div>
                )}

                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${colors.badge}`}>
                  {service.tier}
                </div>

                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{service.description}</p>

                <div className="mb-2">
                  <span className={`text-5xl font-bold ${colors.accent} font-display`}>{service.price}</span>
                </div>
                {service.deliveryTime && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                    Delivery: <span className="font-semibold text-gray-700 dark:text-gray-300">{service.deliveryTime}</span>
                  </p>
                )}

                <ul className="space-y-3 mb-8">
                  {service.features?.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <span className={`mt-0.5 ${colors.accent}`}><FiCheck size={16} /></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    service.isPopular
                      ? 'bg-primary text-white hover:bg-primary-700 shadow-lg shadow-primary/30'
                      : 'border-2 border-current text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600'
                  }`}
                >
                  Get Started <FiArrowRight size={16} />
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 dark:text-gray-400 text-sm mt-10"
        >
          Need a custom package?{' '}
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-primary font-semibold hover:underline"
          >
            Contact me for a quote
          </button>
        </motion.p>
      </div>
    </section>
  );
}
