
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function Product({ resetPage }: { resetPage: () => void }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="mx-auto flex max-w-4xl flex-col items-center gap-10 py-10 md:flex-row md:py-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex flex-col items-center text-center md:items-start md:w-1/2 md:text-left space-y-6"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-4xl font-semibold bg-gradient-to-r from-brand-500 to-violet-600 bg-clip-text text-transparent font-display"
          variants={itemVariants}
        >
          Our Product
        </motion.h1>
        <motion.p 
          className="text-lg leading-8 text-gray-600"
          variants={itemVariants}
        >
          Learn how Smart Recipe Generator makes meal planning effortless.
        </motion.p>
        <motion.ul 
          className="space-y-4 text-gray-500 list-inside dark:text-gray-400 text-left"
          variants={containerVariants}
        >
          {[
            "AI-powered recipe generation using your available ingredients.",
            "Customized recipes based on dietary preferences and restrictions.",
            "User-friendly interface to easily add ingredients and generate recipes.",
            "Option to save, rate, and share your favorite recipes."
          ].map((feature, index) => (
            <motion.li 
              key={index} 
              className="flex items-start text-lg"
              variants={listItemVariants}
              whileHover={{ x: 5 }}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <CheckCircleIcon className="mr-2 h-6 w-6 text-violet-500" />
              </motion.div>
              {feature}
            </motion.li>
          ))}
        </motion.ul>
        <motion.div 
          className="flex gap-4"
          variants={itemVariants}
        >
          <motion.button
            className="w-fit rounded-full bg-gradient-to-r from-brand-500 to-violet-500 px-6 py-3 text-base font-semibold text-white shadow-lg border border-white/20 backdrop-blur-sm font-display"
            onClick={() => signIn('google')}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            Get started
          </motion.button>
          <motion.button
            className="w-fit rounded-full bg-white/90 backdrop-blur-sm px-6 py-3 text-base font-semibold text-violet-600 border border-violet-200 shadow-md font-display"
            onClick={resetPage}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              borderColor: "rgba(139, 92, 246, 0.5)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </motion.div>
      <motion.div 
        className="md:w-1/2"
        variants={containerVariants}
      >
        <motion.div
          className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white/80"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <img
            src="/demo.gif"
            alt="Smart Recipe Generator demo"
            width={600}
            height={400}
            className="w-full h-auto"
            style={{ display: 'block', background: '#fff', borderRadius: '1.5rem' }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
