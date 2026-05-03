
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function Product({ onGetStarted }: { onGetStarted: () => void }) {
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
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring' as const, stiffness: 100 }
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
          Find out how Cuisinova makes planning meals feel simple and cozy.
        </motion.p>
        <motion.div 
          className="grid gap-6 md:grid-cols-2"
          variants={containerVariants}
        >
          {[
            {
              title: 'AI Recipe Generation',
              description: 'Transform ingredients into complete recipes with reliable steps, clear instructions, and practical serving guidance.'
            },
            {
              title: 'Dietary Awareness',
              description: 'Adapt recipes to preferences such as vegan, gluten-free, low-carb, or balanced nutrition without sacrificing flavor.'
            },
            {
              title: 'Smart Substitutions',
              description: 'Swap ingredients confidently based on pantry availability and dietary needs, keeping flavors consistent.'
            },
            {
              title: 'Streamlined Workflow',
              description: 'From ingredient list to recipe card, the interface is built for fast, professional meal planning.'
            }
          ].map((feature) => (
            <motion.div
              key={feature.title}
              className="border border-slate-200 bg-slate-50 p-6 rounded-sm shadow-sm"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-sm leading-6 text-slate-700">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
          className="mt-10 flex justify-center"
          variants={itemVariants}
        >
          <motion.button
            className="w-fit rounded-sm bg-gradient-to-r from-brand-500 to-violet-600 px-6 py-3 text-base font-semibold text-white shadow-sm border border-slate-300 font-display"
            onClick={onGetStarted}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: "0 10px 15px -5px rgba(15, 23, 42, 0.18)" 
            }}
            whileTap={{ scale: 0.97 }}
          >
            Get started
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
