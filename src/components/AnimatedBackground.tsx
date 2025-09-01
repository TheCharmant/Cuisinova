import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  // Generate random positions for floating elements
  const generateRandomPosition = () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
  });

  const floatingElements = [
    { emoji: '✨', size: 'text-2xl', delay: 0 },
    { emoji: '💫', size: 'text-xl', delay: 1 },
    { emoji: '🌸', size: 'text-lg', delay: 2 },
    { emoji: '🍃', size: 'text-base', delay: 3 },
    { emoji: '🦋', size: 'text-lg', delay: 4 },
    { emoji: '🌟', size: 'text-xl', delay: 5 },
    { emoji: '💖', size: 'text-sm', delay: 6 },
    { emoji: '🌺', size: 'text-base', delay: 7 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-brand-50 via-peach-50 to-violet-50"
        animate={{
          background: [
            'linear-gradient(135deg, rgb(254 249 248) 0%, rgb(250 245 255) 100%)',
            'linear-gradient(135deg, rgb(255 251 235) 0%, rgb(254 249 248) 50%, rgb(250 245 255) 100%)',
            'linear-gradient(135deg, rgb(254 249 248) 0%, rgb(250 245 255) 100%)',
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />

      {/* Floating elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.size} opacity-20 select-none`}
          style={generateRandomPosition()}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -10, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: element.delay,
            ease: 'easeInOut',
          }}
        >
          {element.emoji}
        </motion.div>
      ))}

      {/* Subtle geometric shapes */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 border-2 border-peach-200 rounded-full opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className="absolute bottom-32 right-16 w-24 h-24 border-2 border-violet-200 rounded-lg opacity-10"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-brand-200 rounded-full opacity-10"
        animate={{
          scale: [1, 1.4, 1],
          x: [0, 50, -50, 0],
          y: [0, -30, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating bubbles */}
      <motion.div
        className="absolute bottom-20 left-10 w-4 h-4 bg-peach-200 rounded-full opacity-20"
        animate={{
          y: [0, -100, 0],
          x: [0, 20, -20, 0],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-32 right-32 w-6 h-6 bg-violet-200 rounded-full opacity-15"
        animate={{
          y: [0, -80, 0],
          x: [0, -30, 30, 0],
          scale: [0.3, 1.2, 0.3],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-3/4 left-1/3 w-3 h-3 bg-brand-200 rounded-full opacity-25"
        animate={{
          y: [0, -60, 0],
          x: [0, 40, -40, 0],
          scale: [0.8, 0.5, 0.8],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />
    </div>
  );
};

export default AnimatedBackground;