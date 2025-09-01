
import { useState, useEffect } from "react";
import Image from 'next/image';
import useWindowSize from "./Hooks/useWindowSize";
import tagLoad from '../assets/tagload.gif';
import { motion } from 'framer-motion';


interface Tag {
    _id: string;
    count: number;
}

interface PopularTagsProps {
    tags: Tag[];
    onTagToggle: (activeTag: string) => void;
    searchVal: string;
}

const PopularTags = ({ tags: rawTags, onTagToggle, searchVal }: PopularTagsProps) => {
    // Ensure tags is always an array
    const tags = Array.isArray(rawTags) ? rawTags : [];
    const [activeTag, setActiveTag] = useState<string>('');

    const { width } = useWindowSize();

    useEffect(() => {
        if (!searchVal.trim()) {
            setActiveTag('');
        }
    }, [searchVal]);

    const handleTagClick = (tag: string) => {
        const newActiveTag = activeTag === tag ? '' : tag;
        setActiveTag(newActiveTag);
        onTagToggle(newActiveTag);
    };

    // Adjust tag display count based on screen size
    const sliceAmount = width < 640 ? 8 : width < 1024 ? 10 : 20;

    // Animation variants for container and items
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <motion.div 
            className='w-full py-3 px-3 bg-cream-100/90 backdrop-blur-md rounded-3xl shadow-pastel border-2 border-peach-100 kawaii-tags mb-2 relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2 
                className='mb-2 text-lg font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-peach-400 via-brand-400 to-violet-500 flex items-center accent-script pl-2'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}
            >
                <span className="mr-2 text-xl">🏷️</span> Popular Tags
            </motion.h2>
            {/* Edge fade for scroll hint */}
            <div className="pointer-events-none absolute top-[44px] left-0 h-10 w-8 z-10 bg-gradient-to-r from-cream-100/90 via-cream-100/60 to-transparent rounded-l-3xl" />
            <div className="pointer-events-none absolute top-[44px] right-0 h-10 w-8 z-10 bg-gradient-to-l from-cream-100/90 via-cream-100/60 to-transparent rounded-r-3xl" />
                <div className='flex gap-3 overflow-x-auto px-2 items-center min-h-[48px] hide-scrollbar' style={{ WebkitOverflowScrolling: 'touch' }}>
                    {tags.slice(0, sliceAmount).map(({ _id, count }) => (
                        <motion.button
                            key={_id}
                            className={`px-4 py-2 text-base font-bold rounded-full shadow-pastel border flex items-center gap-2 kawaii-chip transition-all duration-300 whitespace-nowrap ${activeTag === _id
                                ? 'bg-gradient-to-r from-peach-300 via-brand-300 to-violet-300 text-violet-700 border-peach-200 ring-2 ring-brand-200 shadow-lg'
                                : 'bg-white/90 border-peach-100 text-brand-600 hover:bg-peach-100 hover:text-violet-600 hover:shadow-lg'
                            }`}
                            onClick={() => handleTagClick(_id)}
                            variants={itemVariants}
                            whileHover={{ scale: 1.10, backgroundColor: '#fff7e6' }}
                            whileTap={{ scale: 0.97 }}
                            style={{ fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}
                        >
                            {_id} <span className="ml-1 px-2 py-0.5 bg-white/60 rounded-full text-xs">{count}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
    );
}

export default PopularTags;
