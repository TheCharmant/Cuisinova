import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Landing({ onGetStarted }: { onGetStarted: () => void }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.25,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 120, damping: 18 },
    },
  };

  return (
    <motion.section
      className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden rounded-[40px] px-4 py-10 md:px-6 lg:px-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="pointer-events-none absolute -left-32 top-12 h-72 w-72 rounded-full bg-brand-100/40 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 rounded-full bg-peach-100/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-white/80 via-white/50 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 rounded-[40px] border border-white/70 bg-white/85 p-8 shadow-glow backdrop-blur-xl md:p-12 lg:flex-row lg:items-center lg:gap-12">
        <motion.div className="md:w-1/2 space-y-7" variants={itemVariants}>
          <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-slate-600">AI-Powered Recipe Platform</p>
          <motion.h1 className="text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl" variants={itemVariants}>
            Discover flavors with Cuisinova
          </motion.h1>
          <motion.p className="max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl" variants={itemVariants}>
            Enter your ingredients once and receive polished, restaurant-inspired recipes tuned to your taste and nutritional needs.
          </motion.p>
          <motion.div className="flex flex-col gap-4 sm:flex-row sm:items-center" variants={itemVariants}>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-violet-600 px-8 py-3 text-base font-semibold text-white shadow-xl shadow-brand-500/20 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Get started
            </button>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Smart Recipe Generator Demo</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Instant menu-ready recipes from pantry inputs.</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="md:w-1/2" variants={itemVariants}>
          <div className="overflow-hidden rounded-[32px] border border-white/70 bg-slate-950/5 shadow-soft">
            <Image
              src="/demo.gif"
              alt="Smart Recipe Generator demo"
              width={800}
              height={560}
              className="h-auto w-full"
              priority
            />
          </div>
        </motion.div>
      </div>

      <motion.div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={containerVariants}>
        {[
          {
            title: 'AI-driven Recipes',
            detail: 'Generate complete recipes from your pantry with reliable step-by-step instructions for every meal.',
          },
          {
            title: 'Dietary Precision',
            detail: 'Adapt recipes to vegan, gluten-free, low-carb, or balanced nutrition without sacrificing flavor.',
          },
          {
            title: 'Professional Workflow',
            detail: 'Move from ingredients to finished recipe cards with clarity and fast decision-making.',
          },
        ].map((card) => (
          <motion.div
            key={card.title}
            className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold text-slate-950 mb-3">{card.title}</h3>
            <p className="text-sm leading-6 text-slate-700">{card.detail}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
