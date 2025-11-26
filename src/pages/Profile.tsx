import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import ProfileInformation from '../components/Profile_Information/ProfileInformation';
import ProfileStickyBanner from '../components/Profile_Information/ProfileStickyBanner';
import ViewRecipes from '../components/Recipe_Display/ViewRecipes';
import { updateRecipeList } from '../utils/utils';
import { ExtendedRecipe } from '../types';
import { call_api } from '../utils/utils';

interface ProfileProps {
    profileData: {
        recipes: ExtendedRecipe[];
        AIusage: number;
        totalGeneratedCount?: number;
        apiRequestLimit?: number;
    }
}

function Profile({ profileData }: ProfileProps) {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [profileDataState, setProfileDataState] = useState(profileData);

    // Defensive checks for undefined/null data
    const safeRecipes = Array.isArray(profileDataState?.recipes) ? profileDataState.recipes : [];
    const [latestRecipes, setLatestRecipes] = useState<ExtendedRecipe[]>(safeRecipes);
    const [displaySetting, setDisplaySetting] = useState('created');

    useEffect(() => {
        const fetchProfileData = async () => {
            if (status === 'loading') return;

            if (!session) {
                setLoading(false);
                return;
            }

            try {
                // Fetch profile data from API
                const data = await call_api({
                    address: '/api/profile',
                    method: 'get'
                });

                setProfileDataState(data);
                setLatestRecipes(data.recipes || []);
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [session, status]);

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
        // Sort by newest first (createdAt descending)
        view.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return view;
    };

    // Defensive checks
    const safeAIusage = typeof profileDataState?.AIusage === 'number' ? profileDataState.AIusage : 0;
    const safeTotalGeneratedCount = typeof profileDataState?.totalGeneratedCount === 'number' ? profileDataState.totalGeneratedCount : 0;
    const safeApiRequestLimit = typeof profileDataState?.apiRequestLimit === 'number' ? profileDataState.apiRequestLimit : 10;

    if (loading || status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session) {
        return <div className="min-h-screen flex items-center justify-center">Please log in to view your profile.</div>;
    }

    return (
        <motion.div
            className="min-h-screen relative overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
        >
            {/* Pinterest-style background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-coquette-softPink/30 to-coquette-lavender/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(247,200,208,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(200,184,234,0.1),transparent_50%)]"></div>


            <motion.div
                className="relative z-10 w-full pb-8"
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } }}
            >
                <div className="w-full">
                    <div className="flex flex-col items-center space-y-6">
                        {/* Show banner only if user has recipes */}
                        <ProfileStickyBanner userHasRecipes={latestRecipes?.filter?.(r => r.owns)?.length !== 0} />
                        <ProfileInformation
                            recipes={latestRecipes}
                            updateSelection={(val) => setDisplaySetting(val)}
                            selectedDisplay={displaySetting}
                            AIusage={safeAIusage}
                            totalGeneratedCount={safeTotalGeneratedCount}
                            apiRequestLimit={safeApiRequestLimit}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Pinterest-style Recipe Grid */}
            <motion.div
                className="relative z-10 w-full pb-16"
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } }}
            >
                <div className="w-full">
                    <ViewRecipes
                        recipes={handleDisplaySetting()}
                        handleRecipeListUpdate={handleRecipeListUpdate}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // For now, return empty data and let client-side handle authentication
    // This avoids session issues in production
    return {
        props: {
            profileData: {
                recipes: [],
                AIusage: 0,
                totalGeneratedCount: 0,
                apiRequestLimit: 10
            },
        },
    };
};

export default Profile;