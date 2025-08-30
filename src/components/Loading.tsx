import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const generationMessages = [
    '🔪 Chopping up some fresh ingredients...',
    '🥘 Stirring the pot with expert precision...',
    '🍳 Heating the pan to the perfect temperature...',
    '🧂 Adding a pinch of magic (and salt)...',
    '🍅 Tossing in the tomatoes—watch out for splashes!',
    '🔥 Turning up the heat for that perfect sear...',
    '🧁 Sprinkling in some creativity and flavor...',
    '🍽️ Plating the dish like a Michelin-star chef...',
    '🥄 Taste-testing... hmm, needs just a little more zest!',
    '🧑‍🍳 Adjusting the seasoning like a pro...',
    '🥖 Tearing up some fresh bread for the side...',
    '🍋 Squeezing in a bit of citrus for balance...',
    '🍷 Deglazing the pan with a splash of wine...',
    '🌀 Blending flavors together into something amazing...',
    '💡 A spark of inspiration—trying a new twist on the recipe!',
    '🌿 Garnishing with a touch of fresh herbs...',
    '⏳ Giving it time to simmer and develop rich flavors...',
    '🎨 Perfecting the presentation—food is art, after all!',
    '📸 Snapping a pic before serving—this one’s a beauty!',
    '🥢 Arranging everything just right before the final reveal...',
];

const savingMessages = [
    '🖼️ Generating beautiful images for your recipe...', // OpenAI image generation
    '🚀 Fetching the perfect visuals from AI...', // OpenAI image retrieval
    '📤 Uploading your recipe images to the cloud...', // Uploading to S3
    '☁️ Storing images securely on our servers...', // Confirming image storage
    '📝 Preparing your recipe details...', // Recipe structuring before saving
    '💾 Saving your recipe to your personal cookbook...', // Database save
    '📑 Finalizing everything and making it just right...', // Final processing
];

const finalGenerationMessage = '🍳 Finalizing your recipe... hold tight, flavor takes time!';
const finalSavingMessage = '🔄 Putting it all together... fetching images, saving your recipe, and making sure everything is perfect!';

const Loading = ({
    isComplete = false,
    isProgressBar = false,
    loadingType = 'generation', // Default to recipe generation
}: {
    isComplete?: boolean;
    isProgressBar?: boolean;
    loadingType?: 'generation' | 'saving';
}) => {
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState(
        loadingType === 'saving' ? savingMessages[0] : generationMessages[0]
    );

    useEffect(() => {
        if (!isProgressBar) return;

        if (isComplete) {
            setProgress(100);
            setCurrentMessage('✅ Your recipe is ready!');
            return;
        }

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    setCurrentMessage(loadingType === 'saving' ? finalSavingMessage : finalGenerationMessage);
                    return prev;
                }

                const newProgress = prev + Math.floor(Math.random() * 4) + 2;

                if (newProgress < 90) {
                    const messages = loadingType === 'saving' ? savingMessages : generationMessages;
                    setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
                } else if (newProgress >= 90) {
                    setCurrentMessage(loadingType === 'saving' ? finalSavingMessage : finalGenerationMessage);
                }

                return Math.min(newProgress, 90);
            });
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [isComplete, isProgressBar, loadingType]);

    // 🚀 Responsive Progress Bar
    if (isProgressBar) {
        return (
            <motion.div 
                className="flex flex-col items-center justify-center mt-8 px-4 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div 
                    className="w-full max-w-lg sm:max-w-md bg-violet-100 rounded-full h-8 shadow-xl relative overflow-hidden backdrop-blur-sm border border-violet-200"
                    whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                >
                    <motion.div
                        className="h-8 rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-violet-500 shadow-md"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        style={{
                            width: `${progress}%`,
                            transition: 'width 0.5s ease-in-out',
                        }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    />
                </motion.div>
                <motion.p 
                    className="mt-6 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-violet-600 text-center px-2 font-display"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    key={currentMessage} // Force animation to restart when message changes
                >
                    {currentMessage}
                </motion.p>
                <motion.div 
                    className="mt-2 px-4 py-1 bg-white/80 rounded-full shadow-md backdrop-blur-sm border border-violet-100"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.3 }}
                >
                    <p className="text-sm text-violet-600 font-medium">{progress}% completed</p>
                </motion.div>
            </motion.div>
        );
    }

    // Default Spinner for Other Scenarios
    return (
        <motion.div 
            className="flex flex-col items-center justify-center mt-8 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div 
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <div className="h-28 w-28 rounded-full border-t-8 border-b-8 border-violet-100 shadow-lg"></div>
                <motion.div 
                    className="absolute top-0 left-0 h-28 w-28 rounded-full border-t-8 border-b-8 border-brand-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                ></motion.div>
                <motion.div 
                    className="absolute top-0 left-0 h-28 w-28 rounded-full border-l-8 border-r-8 border-violet-400"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                ></motion.div>
            </motion.div>
            
            <motion.p 
                className="mt-8 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-violet-600 text-center px-4 max-w-md font-display"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                key={currentMessage} // Force animation to restart when message changes
            >
                {currentMessage}
            </motion.p>
        </motion.div>
    );
};

export default Loading;
