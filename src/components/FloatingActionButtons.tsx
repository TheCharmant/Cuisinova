import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PlusIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FloatingActionButtons Component
 * 
 * This component provides:
 * - A "Create Recipe" button (always visible).
 * - A "Scroll to Top" button (appears after scrolling down).
 */
const FloatingActionButtons = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

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
      {/* "Create Recipe" Button (Always Visible) */}
      <motion.button
        onClick={() => router.push('/CreateRecipe')}
        className="bg-gradient-to-r from-brand-500 to-violet-500 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-2xl transition-all duration-300"
        aria-label="Create Recipe"
        whileHover={{ scale: 1.1, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <PlusIcon className="h-8 w-8" />
      </motion.button>

      {/* Scroll to Top Button (Appears on Scroll) */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            className="bg-white text-violet-500 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl hover:bg-violet-50 hover:text-violet-600 border border-violet-200 backdrop-blur-sm"
            aria-label="Scroll to Top"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            whileHover={{ scale: 1.1, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUpIcon className="h-7 w-7" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionButtons;
