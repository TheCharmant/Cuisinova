import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Landing() {
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
                    Cook Smarter with AI
                </motion.h1>
                <motion.p 
                    className="text-lg leading-8 text-gray-700"
                    variants={itemVariants}
                >
                    Drop in the ingredients you have on hand and let our AI whip up creative recipes tailored to your dietary needs.
                </motion.p>
                <motion.button
                    className="w-fit rounded-full bg-gradient-to-r from-brand-500 to-violet-500 px-6 py-3 text-base font-semibold text-white shadow-lg border border-white/20 backdrop-blur-sm font-display"
                    onClick={() => signIn('google')}
                    variants={itemVariants}
                    whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                    }}
                    whileTap={{ scale: 0.95 }}
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
                    className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white/80"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
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