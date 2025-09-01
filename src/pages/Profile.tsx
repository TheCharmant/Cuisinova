import { GetServerSideProps } from 'next';
import { useState } from 'react';
import ProfileInformation from '../components/Profile_Information/ProfileInformation';
import ProfileStickyBanner from '../components/Profile_Information/ProfileStickyBanner';
import ViewRecipes from '../components/Recipe_Display/ViewRecipes';
import { getServerSidePropsUtility, updateRecipeList } from '../utils/utils';
import { ExtendedRecipe } from '../types';

interface ProfileProps {
    profileData: {
        recipes: ExtendedRecipe[];
        AIusage: number
    }
}

function Profile({ profileData }: ProfileProps) {
    // Defensive checks for undefined/null data
    const safeRecipes = Array.isArray(profileData?.recipes) ? profileData.recipes : [];
    const [latestRecipes, setLatestRecipes] = useState<ExtendedRecipe[]>(safeRecipes);
    const [displaySetting, setDisplaySetting] = useState('created');

    const handleRecipeListUpdate = (recipe: ExtendedRecipe | null, deleteId?: string) => {
        setLatestRecipes(updateRecipeList(latestRecipes, recipe, deleteId));
    };

    const handleDisplaySetting = () => {
        let view: ExtendedRecipe[] = [];
        if (displaySetting === 'created') {
            view = latestRecipes?.filter?.(r => r.owns) || [];
        } else if (displaySetting === 'favorites') {
            view = latestRecipes?.filter?.(r => r.liked) || [];
        } else {
            view = latestRecipes?.filter?.(r => r.owns && Array.isArray(r.likedBy) && r.likedBy.length > 0) || [];
        }
        return view;
    };

    // Defensive check for AIusage
    const safeAIusage = typeof profileData?.AIusage === 'number' ? profileData.AIusage : 0;

    if (!profileData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen items-center bg-gradient-to-br from-cream-100 via-peach-100 to-violet-100 px-4 py-12 relative overflow-x-hidden">
            {/* Kawaii sparkles accent */}
            <span className="absolute left-10 top-10 text-4xl opacity-50 animate-bounceSparkle select-none pointer-events-none">2728</span>
            {/* Show banner only if user has recipes */}
            <ProfileStickyBanner userHasRecipes={latestRecipes?.filter?.(r => r.owns)?.length !== 0} />
            <ProfileInformation
                recipes={latestRecipes}
                updateSelection={(val) => setDisplaySetting(val)}
                selectedDisplay={displaySetting}
                AIusage={safeAIusage}
            />
            {/* Polaroid-style recipe cards with preview dialog */}
            <div className="w-full max-w-5xl mt-8">
                <ViewRecipes
                    recipes={handleDisplaySetting()}
                    handleRecipeListUpdate={handleRecipeListUpdate}
                />
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return await getServerSidePropsUtility(context, 'api/profile', 'profileData')
};

export default Profile;