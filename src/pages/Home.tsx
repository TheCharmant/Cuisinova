import { useEffect, useState, useRef, useCallback } from 'react';
import { ClockIcon, FireIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { Menu } from '@headlessui/react';
import SearchBar from '../components/SearchBar';
import ViewRecipes from '../components/Recipe_Display/ViewRecipes';
import FloatingActionButtons from '../components/FloatingActionButtons';
import Loading from '../components/Loading';
import { usePagination } from '../components/Hooks/usePagination';
import { motion } from 'framer-motion';

const Home = () => {
    const [searchVal, setSearchVal] = useState('');
    const [sortOption, setSortOption] = useState<'recent' | 'popular'>('popular');
    const [searchTrigger, setSearchTrigger] = useState<true | false>(false);
    const [showSortModal, setShowSortModal] = useState(false);
    const [filterOption, setFilterOption] = useState<'all' | 'liked' | 'saved'>('all');

    const observerRef = useRef<IntersectionObserver | null>(null);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const lastRecipeRef = useRef<HTMLDivElement | null>(null);

    const isSearching = searchVal.trim() !== "";
    const endpoint = isSearching ? "/api/search-recipes" : "/api/get-recipes";

    const {
        data: latestRecipes,
        loading,
        loadMore,
        handleRecipeListUpdate,
        totalRecipes,
        page,
        totalPages
    } = usePagination({
        endpoint,
        sortOption,
        filterOption,
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
        setSearchTrigger(true);
    }, []);

    const sortRecipes = (option: 'recent' | 'popular') => {
        if (sortOption === option || isSearching) return;
        setSortOption(option);
        setSearchTrigger(true);
        setShowSortModal(false);
    };

    const filterRecipes = (option: 'all' | 'liked' | 'saved') => {
        if (filterOption === option || isSearching) return;
        setFilterOption(option);
        setSearchTrigger(true);
        setShowSortModal(false);
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
            className="min-h-screen relative overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Pinterest-style background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-coquette-softPink/30 to-coquette-lavender/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(247,200,208,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(200,184,234,0.1),transparent_50%)]"></div>
            {/* Hero Section - Pinterest style */}
            <motion.div
                className="relative z-10 w-full py-16"
                variants={itemVariants}
            >
                <div className="w-full">
                    <div className="text-center mb-12">
                        <motion.h1
                            className="text-5xl md:text-7xl font-bold coquette-text mb-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            CUISINOVA
                        </motion.h1>
                        <motion.p
                            className="text-xl md:text-2xl text-coquette-rose max-w-3xl mx-auto coquette-body font-medium leading-relaxed px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Discover flavors for every mood — cozy meals, sweet snacks, and tasty sips made easy with AI
                        </motion.p>
                    </div>
                </div>
            </motion.div>
            
            {/* Search and Controls Section */}
            <motion.div
                className="relative z-10 w-full pb-8"
                variants={itemVariants}
            >
                <div className="w-full">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="w-full max-w-2xl flex flex-row items-center justify-center gap-2">
                            <motion.div className="flex-1 w-full">
                                <SearchBar
                                    searchVal={searchVal}
                                    setSearchVal={setSearchVal}
                                    handleSearch={handleSearch}
                                    totalRecipes={totalRecipes}
                                />
                            </motion.div>

                            {/* Filter/Sort Icon Button */}
                            <motion.button
                                className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-delicate border-2 border-coquette-blush/50 hover:shadow-glow transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSortModal(true)}
                            >
                                <svg className="w-6 h-6 text-coquette-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                </svg>
                            </motion.button>
                        </div>

                        {/* Results Counter */}
                        {searchVal.trim() && (
                            <motion.div
                                className="text-center px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <p className="text-coquette-lavender coquette-body">
                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                    Found {totalRecipes} recipe{totalRecipes !== 1 ? 's' : ''} for "{searchVal}"
                                    <span className="ml-1">✨</span>
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
            


            {/* Pinterest-style Recipe Grid */}
            <motion.div
                className="relative z-10 w-full pb-16"
                variants={itemVariants}
            >
                <div className="w-full">
                    <ViewRecipes
                        recipes={latestRecipes}
                        handleRecipeListUpdate={handleRecipeListUpdate}
                        lastRecipeRef={lastRecipeRef}
                    />
                </div>
            </motion.div>
            
            {/* Floating Action Button */}
            <motion.div
                className="fixed bottom-6 right-6 z-20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
            >
                <FloatingActionButtons />
            </motion.div>

            {/* Loading Overlay */}
            {loading && !isSearching && (
                <motion.div
                    className="fixed inset-0 z-30 flex items-center justify-center bg-white/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <Loading />
                </motion.div>
            )}

            {/* Sort/Filter Modal */}
            {showSortModal && (
                <motion.div
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSortModal(false)}
                >
                    <motion.div
                        className="bg-white rounded-3xl p-6 m-4 max-w-sm w-full shadow-glow border border-coquette-blush/30"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-coquette-rose mb-4 text-center coquette-text">Sort & Filter Recipes</h3>
                        <div className="space-y-3">
                            <div className="text-sm font-medium text-coquette-lavender mb-2">Sort by:</div>
                            <button
                                onClick={() => sortRecipes('popular')}
                                className={`w-full p-3 rounded-2xl font-medium transition-all duration-200 ${
                                    sortOption === 'popular'
                                        ? 'bg-coquette-blush text-white shadow-delicate'
                                        : 'bg-coquette-softPink/50 text-coquette-rose hover:bg-coquette-blush/20'
                                }`}
                            >
                                🔥 Most Popular
                            </button>
                            <button
                                onClick={() => sortRecipes('recent')}
                                className={`w-full p-3 rounded-2xl font-medium transition-all duration-200 ${
                                    sortOption === 'recent'
                                        ? 'bg-coquette-blush text-white shadow-delicate'
                                        : 'bg-coquette-softPink/50 text-coquette-rose hover:bg-coquette-blush/20'
                                }`}
                            >
                                🕒 Most Recent
                            </button>
                            <div className="text-sm font-medium text-coquette-lavender mb-2 mt-4">Filter by:</div>
                            <button
                                onClick={() => filterRecipes('all')}
                                className={`w-full p-3 rounded-2xl font-medium transition-all duration-200 ${
                                    filterOption === 'all'
                                        ? 'bg-coquette-blush text-white shadow-delicate'
                                        : 'bg-coquette-softPink/50 text-coquette-rose hover:bg-coquette-blush/20'
                                }`}
                            >
                                📚 All Recipes
                            </button>
                            <button
                                onClick={() => filterRecipes('liked')}
                                className={`w-full p-3 rounded-2xl font-medium transition-all duration-200 ${
                                    filterOption === 'liked'
                                        ? 'bg-coquette-blush text-white shadow-delicate'
                                        : 'bg-coquette-softPink/50 text-coquette-rose hover:bg-coquette-blush/20'
                                }`}
                            >
                                ❤️ Liked Recipes
                            </button>
                            <button
                                onClick={() => filterRecipes('saved')}
                                className={`w-full p-3 rounded-2xl font-medium transition-all duration-200 ${
                                    filterOption === 'saved'
                                        ? 'bg-coquette-blush text-white shadow-delicate'
                                        : 'bg-coquette-softPink/50 text-coquette-rose hover:bg-coquette-blush/20'
                                }`}
                            >
                                💾 Saved Recipes
                            </button>
                        </div>
                        <button
                            onClick={() => setShowSortModal(false)}
                            className="w-full mt-4 p-2 text-coquette-lavender hover:text-coquette-rose transition-colors"
                        >
                            Cancel
                        </button>
                    </motion.div>
                </motion.div>
            )}
            
            {/* Empty State */}
            {!loading && latestRecipes.length === 0 && (
                <motion.div
                    className="relative z-10 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="w-full">
                        <motion.div
                            className="flex flex-col items-center justify-center p-16 coquette-card shadow-delicate border border-coquette-blush/30 max-w-2xl mx-auto relative"
                        >
                            <SparklesIcon className="h-20 w-20 text-coquette-lavender mb-6 animate-gentleGlow" />
                            <h3 className="text-2xl font-bold text-coquette-rose mb-4 coquette-text text-center">
                                {searchVal
                                    ? `No recipes found for "${searchVal}"`
                                    : "No recipes found yet"}
                                <span className="ml-2">💔</span>
                            </h3>
                            <p className="text-coquette-lavender text-center coquette-body text-lg leading-relaxed mb-6 px-4">
                                {searchVal
                                    ? "Try searching for different ingredients or create your own magical recipe! ✨"
                                    : "Be the first to create something delicious! Start by adding your favorite ingredients. 🌸"}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Home;
