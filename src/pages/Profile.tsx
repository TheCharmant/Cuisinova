import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { getSession } from 'next-auth/react';
import mongoose from 'mongoose';
import ProfileInformation from '../components/Profile_Information/ProfileInformation';
import ProfileStickyBanner from '../components/Profile_Information/ProfileStickyBanner';
import ViewRecipes from '../components/Recipe_Display/ViewRecipes';
import { updateRecipeList, filterResults } from '../utils/utils';
import { ExtendedRecipe } from '../types';
import { connectDB } from '../lib/mongodb';
import Recipe from '../models/recipe';
import aigenerated from '../models/aigenerated';

interface ProfileProps {
    profileData: {
        recipes: ExtendedRecipe[];
        AIusage: number;
        totalGeneratedCount?: number;
        apiRequestLimit?: number;
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
        // Sort by newest first (createdAt descending)
        view.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return view;
    };

    // Defensive checks
    const safeAIusage = typeof profileData?.AIusage === 'number' ? profileData.AIusage : 0;
    const safeTotalGeneratedCount = typeof profileData?.totalGeneratedCount === 'number' ? profileData.totalGeneratedCount : 0;
    const safeApiRequestLimit = typeof profileData?.apiRequestLimit === 'number' ? profileData.apiRequestLimit : 10;

    if (!profileData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
    try {
        const session = await getSession(context);
        if (!session) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        // Convert session user ID to a mongoose ObjectId
        const mongooseUserId = new mongoose.Types.ObjectId(session.user.id);

        // Connect to the database
        await connectDB();

        // Fetch recipes owned or liked by the user
        const profilePins = await Recipe.find({
            $or: [{ owner: mongooseUserId }, { likedBy: mongooseUserId }],
        })
            .populate(['owner', 'likedBy', 'comments.user'])
            .lean()
            .exec() as unknown as ExtendedRecipe[];

        // Count the number of AI-generated entries associated with the user's ID to get overall usage
        const totalGeneratedCount = await aigenerated.countDocuments({ userId: session.user.id }).exec();
        const apiRequestLimit = 10;
        const AIusage = Math.min(Math.round((totalGeneratedCount / apiRequestLimit) * 100), 100);
        // Filter results based on user session and respond with the filtered recipes
        const filteredRecipes = filterResults(profilePins, session.user.id);

        return {
            props: {
                profileData: {
                    recipes: filteredRecipes,
                    AIusage,
                    totalGeneratedCount,
                    apiRequestLimit
                },
            },
        };
    } catch (error) {
        console.error('Failed to fetch profile data:', error);
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
    }
};

export default Profile;