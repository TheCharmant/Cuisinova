import { useEffect, useState, useRef, useCallback } from 'react';
import { ClockIcon, FireIcon, SparklesIcon } from '@heroicons/react/24/solid';
import SearchBar from '../components/SearchBar';
import ViewRecipes from '../components/Recipe_Display/ViewRecipes';
import FloatingActionButtons from '../components/FloatingActionButtons';
import Loading from '../components/Loading';
import PopularTags from '../components/PopularTags';
import { usePagination } from '../components/Hooks/usePagination';
import { motion } from 'framer-motion';

const Home = () => {
    const [searchVal, setSearchVal] = useState('');
    const [sortOption, setSortOption] = useState<'recent' | 'popular'>('popular');
    const [searchTrigger, setSearchTrigger] = useState<true | false>(false);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const lastRecipeRef = useRef<HTMLDivElement | null>(null);

    const isSearching = searchVal.trim() !== "";
    const endpoint = isSearching ? "/api/search-recipes" : "/api/get-recipes";

    const {
        data: latestRecipes,
        loading,
        popularTags,
        loadMore,
        handleRecipeListUpdate,
        totalRecipes,
        page,
        totalPages
    } = usePagination({
        endpoint,
        sortOption,
        searchQuery: searchVal.trim(),
        searchTrigger,
        resetSearchTrigger: () => setSearchTrigger(false),
    });
    useEffect(() => {
        if (!latestRecipes.length) return;

        const lastRecipeElement = lastRecipeRef.current;
        if (!lastRecipeElement) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting && !loading && page < totalPages) {
                loadMore();
                if (searchVal.trim() && !searchTrigger) {
                    setSearchTrigger(true);
                }
            }
        }, { threshold: 0.5 });

        observerRef.current.observe(lastRecipeElement);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null; // Ensure observerRef is fully reset
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latestRecipes, loading]);

    const handleSearch = useCallback(() => {
        if (!searchVal.trim()) return;

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
            searchTimeout.current = null; // Explicitly reset the timeout reference
        }

        searchTimeout.current = setTimeout(() => {
            setSearchTrigger(true);
        }, 500);
    }, [searchVal]);

    const sortRecipes = (option: 'recent' | 'popular') => {
        if (sortOption === option || isSearching) return;
        setSortOption(option);
        setSearchTrigger(true);
    };

    const handleTagSearch = async (tag: string) => {
        if (searchVal === tag) {
            setSearchVal(""); // Reset search if clicking the same tag
            return;
        }

        setSearchVal(tag);
        setSearchTrigger(true);
    };

    // Animation variants for staggered children
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <motion.div 
            className="flex flex-col min-h-screen items-center px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-gradient-to-br from-brand-50 to-violet-50"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Hero Section */}
            <motion.div 
                className="w-full max-w-4xl text-center mb-8"
                variants={itemVariants}
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-violet-600 text-transparent bg-clip-text font-display">
                    Discover Delicious Recipes
                </h1>
                <p className="text-lg md:text-xl text-violet-700 max-w-2xl mx-auto">
                    Find the perfect recipe for any occasion with our smart recipe generator
                </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="w-full max-w-4xl">
                <SearchBar searchVal={searchVal} setSearchVal={setSearchVal} handleSearch={handleSearch} totalRecipes={totalRecipes} />
            </motion.div>
            
            <motion.div variants={itemVariants} className="w-full max-w-4xl">
                <PopularTags tags={popularTags} onTagToggle={handleTagSearch} searchVal={searchVal} />
            </motion.div>

            {/* Sorting Buttons */}
            <motion.div 
                className="flex flex-wrap justify-center gap-4 w-full max-w-4xl my-2"
                variants={itemVariants}
            >
                <motion.button
                    onClick={() => sortRecipes('recent')}
                    className={`disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-white flex items-center px-6 py-3 rounded-full shadow-lg transition-all duration-300 ${sortOption === 'recent' 
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white' 
                        : 'bg-white text-violet-700 hover:bg-violet-50 hover:shadow-xl border border-violet-200'
                    }`}
                    disabled={Boolean(searchVal.trim())}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Most Recent
                </motion.button>
                <motion.button
                    onClick={() => sortRecipes('popular')}
                    className={`disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-white flex items-center px-6 py-3 rounded-full shadow-lg transition-all duration-300 ${sortOption === 'popular' 
                        ? 'bg-gradient-to-r from-brand-500 to-violet-600 text-white' 
                        : 'bg-white text-violet-700 hover:bg-violet-50 hover:shadow-xl border border-violet-200'
                    }`}
                    disabled={Boolean(searchVal.trim())}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FireIcon className="h-5 w-5 mr-2" />
                    Most Popular
                </motion.button>
            </motion.div>

            <motion.div 
                className="w-full max-w-6xl"
                variants={itemVariants}
            >
                <ViewRecipes
                    recipes={latestRecipes}
                    handleRecipeListUpdate={handleRecipeListUpdate}
                    lastRecipeRef={lastRecipeRef}
                />
            </motion.div>
            
            <FloatingActionButtons />

            {/* Show loading indicator when fetching */}
            {loading && <Loading />}
            
            {/* Empty state when no recipes */}
            {!loading && latestRecipes.length === 0 && (
                <motion.div 
                    className="flex flex-col items-center justify-center p-10 bg-white/80 rounded-2xl shadow-lg border border-violet-100 max-w-md w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <SparklesIcon className="h-16 w-16 text-violet-400 mb-4" />
                    <h3 className="text-xl font-bold text-violet-700 mb-2">No recipes found</h3>
                    <p className="text-violet-600 text-center">
                        Try adjusting your search or create a new recipe to get started!
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Home;
