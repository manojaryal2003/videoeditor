import { motion } from 'framer-motion';

export default function Loader({ full = false }) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-dark-600 border-t-primary"
      />
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
    </div>
  );

  if (full) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-dark-900">
        {content}
      </div>
    );
  }

  return <div className="flex justify-center items-center py-20">{content}</div>;
}
