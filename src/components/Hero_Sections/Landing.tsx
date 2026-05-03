import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Landing({ onGetStarted }: { onGetStarted: () => void }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
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

    return (
        <>
            <motion.div 
                className="mx-auto flex max-w-4xl flex-col items-center gap-10 py-10 md:flex-row md:py-20 px-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div 
                    className="flex flex-col items-center text-center md:items-start md:text-left md:w-1/2 space-y-6"
                    variants={containerVariants}
                >
                    <motion.h1 
                        className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand-500 to-violet-500 bg-clip-text text-transparent font-display"
                        variants={itemVariants}
                    >
                        Discover flavors with Cuisinova
                    </motion.h1>
                    <motion.p 
                        className="text-lg leading-8 text-slate-700"
                        variants={itemVariants}
                    >
                        Enter your ingredients once and receive polished, restaurant-inspired recipes tuned to your taste and nutritional needs.
                    </motion.p>
                    <motion.button
                        className="w-fit rounded-sm bg-gradient-to-r from-brand-500 to-violet-600 px-6 py-3 text-base font-semibold text-white shadow-sm border border-slate-300 font-display"
                        onClick={onGetStarted}
                        variants={itemVariants}
                        whileHover={{ 
                            scale: 1.03, 
                            boxShadow: "0 10px 15px -5px rgba(15, 23, 42, 0.18)" 
                        }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Get started
                    </motion.button>
                </motion.div>
                <motion.div 
                    className="md:w-1/2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="relative overflow-hidden rounded-sm shadow-sm border border-slate-200"
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                    >
                        <Image
                            src="/demo.gif"
                            alt="Smart Recipe Generator demo"
                            width={600}
                            height={400}
                            className="w-full h-auto"
                            style={{ display: 'block' }}
                            priority
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
            <motion.div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={containerVariants}>
                {[
                    {
                        title: 'AI-driven Recipes',
                        detail: 'Generate complete recipes from your pantry with reliable step-by-step instructions for every meal.'
                    },
                    {
                        title: 'Dietary Precision',
                        detail: 'Tailor recipes to dietary preferences like vegan, gluten-free, low-carb, or high-protein.'
                    },
                    {
                        title: 'Practical Meal Planning',
                        detail: 'Plan menus with balanced flavors and practical substitutions for any kitchen.'
                    }
                ].map((card) => (
                    <motion.div
                        key={card.title}
                        className="border border-slate-200 bg-slate-50 p-6 rounded-sm shadow-sm"
                        variants={itemVariants}
                    >
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">{card.title}</h3>
                        <p className="text-sm leading-6 text-slate-700">{card.detail}</p>
                    </motion.div>
                ))}
            </motion.div>
        </>
    );
}