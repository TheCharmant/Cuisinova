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
      <div className="sticky top-16 mt-2 bg-minimalist-sky/60 border-l-4 border-minimalist-blue text-minimalist-slate p-4 rounded-xl shadow-delicate flex items-center justify-between animate-fadeInUp z-10">
        <div>
          <p className="font-semibold text-lg text-minimalist-slate">Ready to cook?</p>
          <p>Create your first recipe and share your culinary ideas.</p>
          <button
            className="mt-2 bg-minimalist-slate text-minimalist-sand px-4 py-2 rounded-full shadow-delicate hover:bg-minimalist-slate/90 transition-colors duration-200"
            onClick={() => router.push('/CreateRecipe')}
          >
            Create a recipe
          </button>
        </div>
        <button onClick={dismissBanner} className="ml-4 text-minimalist-slate/60 hover:text-minimalist-slate transition-colors duration-200" aria-label='close'>
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
    );
  };
  

export default ProfileStickyBanner;
