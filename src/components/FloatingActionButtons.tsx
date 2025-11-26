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
        className="bg-gradient-to-br from-peach-300 via-brand-300 to-violet-300 text-white w-20 h-20 rounded-full shadow-pastel flex items-center justify-center text-4xl border-4 border-peach-100 kawaii-fab transition-all duration-300 hover:shadow-xl"
        aria-label="Create Recipe"
        whileHover={{ scale: 1.13, rotate: 6 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        style={{ fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}
      >
        🍳
      </motion.button>

      {/* Scroll to Top Button (Appears on Scroll) */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            className="bg-cream-100 text-violet-500 w-12 h-12 rounded-full shadow-pastel flex items-center justify-center hover:bg-peach-100 hover:text-violet-600 border-2 border-violet-200 backdrop-blur-md kawaii-fab transition-all duration-300"
            aria-label="Scroll to Top"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            whileHover={{ scale: 1.13, rotate: -6 }}
            whileTap={{ scale: 0.97 }}
            style={{ fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}
          >
            <ArrowUpIcon className="h-6 w-6 opacity-80" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionButtons;
