
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'AI Recipe Generation',
    description: 'Transform ingredients into complete recipes with reliable steps, clear instructions, and practical serving guidance.',
  },
  {
    title: 'Dietary Awareness',
    description: 'Adapt recipes to preferences such as vegan, gluten-free, low-carb, or balanced nutrition without sacrificing flavor.',
  },
  {
    title: 'Smart Substitutions',
    description: 'Swap ingredients confidently based on pantry availability and dietary needs, keeping flavors consistent.',
  },
  {
    title: 'Streamlined Workflow',
    description: 'From ingredient list to recipe card, the interface is built for fast, professional meal planning.',
  },
];

export default function Product({ onGetStarted }: { onGetStarted: () => void }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 110, damping: 18 },
    },
  };

  return (
    <motion.div
      className="relative mx-auto flex max-w-7xl flex-col gap-10 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-x-0 -top-16 h-56 bg-gradient-to-r from-brand-100/60 via-white/80 to-peach-100/60 blur-3xl" />
      <div className="relative flex w-full flex-col gap-6 overflow-x-auto pb-6 lg:overflow-visible lg:pb-0">
        <div className="flex min-w-full gap-6 lg:grid lg:min-w-0 lg:grid-cols-4">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="min-w-[20rem] rounded-[30px] border border-white/60 bg-white/90 p-7 shadow-glow transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl lg:min-w-0"
              variants={itemVariants}
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-100/80 text-brand-700 shadow-sm">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950 mb-3">{feature.title}</h3>
              <p className="text-sm leading-7 text-slate-700">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div className="mt-6 flex justify-center" variants={itemVariants}>
        <button
          className="rounded-full bg-slate-950 px-8 py-3 text-base font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
          onClick={onGetStarted}
        >
          Get started
        </button>
      </motion.div>
    </motion.div>
  );
}
