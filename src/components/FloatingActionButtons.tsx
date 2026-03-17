import { useState, useEffect } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FloatingActionButtons Component
 * 
 * This component provides:
 * - A "Scroll to Top" button (appears after scrolling down).
 */
const FloatingActionButtons = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300); // Show scroll button after scrolling 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-4 z-50">
      {/* Scroll to Top Button (Appears on Scroll) */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            className="bg-minimalist-sky/70 text-minimalist-slate w-11 h-11 rounded-full shadow-delicate flex items-center justify-center border border-minimalist-blue/60 backdrop-blur-md transition-colors duration-200"
            aria-label="Scroll to Top"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowUpIcon className="h-6 w-6 opacity-80" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionButtons;
