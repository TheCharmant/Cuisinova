import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { XMarkIcon } from '@heroicons/react/24/solid';

const ProfileStickyBanner = ({ userHasRecipes }: { userHasRecipes: boolean }) => {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
      // Show banner if the user has no recipes & hasn't dismissed it
      if (!userHasRecipes && !localStorage.getItem('dismissedRecipeBanner')) {
        setIsVisible(true);
      }
    }, [userHasRecipes]);
  
    const dismissBanner = () => {
      setIsVisible(false);
      localStorage.setItem('dismissedRecipeBanner', 'true'); // Remember user dismissed it
    };
  
    if (!isVisible) return null; // Don't render if dismissed
  
    return (
      <div className="sticky top-16 mt-2 bg-gradient-to-r from-brand-50 to-violet-50 border-l-4 border-violet-400 text-violet-800 p-4 rounded-xl shadow-lg flex items-center justify-between animate-fadeInUp z-10">
        <div>
          <p className="font-semibold text-lg bg-gradient-to-r from-brand-500 to-violet-600 bg-clip-text text-transparent">✨ Ready to Cook?</p>
          <p>Create your first recipe now and share your culinary ideas!</p>
          <button
            className="mt-2 bg-gradient-to-r from-brand-500 to-violet-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            onClick={() => router.push('/CreateRecipe')}
          >
            🍽️ Create a Recipe
          </button>
        </div>
        <button onClick={dismissBanner} className="ml-4 text-violet-400 hover:text-violet-600 transition-colors duration-300" aria-label='close'>
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
    );
  };
  

export default ProfileStickyBanner;
