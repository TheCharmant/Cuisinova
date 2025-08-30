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

const PopularTags = ({ tags, onTagToggle, searchVal }: PopularTagsProps) => {
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
            className='w-full py-6 px-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-violet-100'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2 
                className='mb-4 text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-violet-600 flex items-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <span className="mr-2 text-2xl">✨</span> Popular Tags
            </motion.h2>
            
            <motion.div 
                className='flex flex-wrap gap-3'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {tags.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src={tagLoad}
                            alt="tag-load-gif"
                            width={50}
                            height={50}
                            className="rounded-full shadow-md"
                        />
                    </motion.div>
                ) : (
                    tags.slice(0, sliceAmount).map(({ _id, count }) => (
                        <motion.button
                            key={_id}
                            className={`px-4 py-2 text-sm font-medium rounded-full shadow-md transition-all duration-300 ${activeTag === _id
                                ? 'bg-gradient-to-r from-brand-500 to-violet-500 text-white shadow-lg'
                                : 'bg-white border border-violet-200 text-gray-700 hover:border-violet-300 hover:text-violet-700 hover:shadow-lg'
                            }`}
                            onClick={() => handleTagClick(_id)}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {_id} <span className="ml-1 px-2 py-0.5 bg-white/30 rounded-full text-xs">{count}</span>
                        </motion.button>
                    ))
                )}
            </motion.div>
        </motion.div>
    );
};

export default PopularTags;
