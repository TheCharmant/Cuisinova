import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { ExtendedRecipe } from '../../types';
import { Button } from '@headlessui/react';

interface ProfileInformationProps {
    recipes: ExtendedRecipe[];
    updateSelection: (s: string) => void;
    selectedDisplay: string;
    AIusage: number;
}

function ProfileInformation({ recipes, updateSelection, selectedDisplay, AIusage }: ProfileInformationProps) {
    const { data: session } = useSession();

    if (!session || !session.user) return null;

    const { user } = session;

    const ownedRecipes = recipes.filter(r => r.owns);
    const favoriteRecipes = recipes.filter(r => r.liked);
    const votesReceived = ownedRecipes.reduce((total, recipe) => total + recipe.likedBy.length, 0);

    // Determine progress bar color based on AI usage percentage
    const getUsageColor = (usage: number) => {
        if (usage <= 50) return 'bg-gradient-to-r from-brand-500 to-violet-500'; // Low usage: Pink-Violet
        if (usage <= 75) return 'bg-yellow-500'; // Medium usage: Yellow
        return 'bg-red-500'; // High usage: Red
    };

    return (
        <div className="w-full max-w-sm bg-white border border-violet-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mt-5 animate-fadeInUp">
            <div className="flex justify-end"></div>
            <div className="flex flex-col items-center pb-10 px-4 pt-4">
                <Image
                    src={user?.image || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                    width={75}
                    height={75}
                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                    alt={`profile-${user.name}`}
                />
                <h5 className="mb-1 text-xl font-medium bg-gradient-to-r from-brand-500 to-violet-600 bg-clip-text text-transparent">{user.name}</h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                <div className="grid grid-cols-3 gap-4 text-center mt-4">
                    <div>
                        <div className="text-lg font-medium text-black">{ownedRecipes.length}</div>
                        <Button
                            onClick={() => updateSelection('created')}
                            className={`bg-white rounded-full px-2 py-1 transition-all duration-300 ${
                                selectedDisplay === 'created' ? 'bg-gradient-to-r from-brand-500 to-violet-500 text-white font-bold shadow-md' : 'text-gray-700 hover:text-violet-600 border border-violet-200 hover:border-violet-400'
                            }`}
                        >
                            Recipes Created
                        </Button>
                    </div>
                    <div>
                        <div className="text-lg font-medium text-black">{votesReceived}</div>
                        <Button
                            onClick={() => updateSelection('votes received')}
                            className={`bg-white rounded-full px-2 py-1 transition-all duration-300 ${
                                selectedDisplay === 'votes received' ? 'bg-gradient-to-r from-brand-500 to-violet-500 text-white font-bold shadow-md' : 'text-gray-700 hover:text-violet-600 border border-violet-200 hover:border-violet-400'
                            }`}
                        >
                            Votes Received
                        </Button>
                    </div>
                    <div>
                        <div className="text-lg font-medium text-black">{favoriteRecipes.length}</div>
                        <Button
                            onClick={() => updateSelection('favorites')}
                            className={`bg-white rounded-full px-2 py-1 transition-all duration-300 ${
                                selectedDisplay === 'favorites' ? 'bg-gradient-to-r from-brand-500 to-violet-500 text-white font-bold shadow-md' : 'text-gray-700 hover:text-violet-600 border border-violet-200 hover:border-violet-400'
                            }`}
                        >
                            Favorites
                        </Button>
                    </div>
                </div>

                {/* AI Usage Progress Bar */}
                <div className="w-full mt-6">
                    <div className="text-sm text-violet-600 font-medium text-center mb-1">AI Usage: {AIusage}%</div>
                    <div className="w-full bg-violet-100 rounded-full h-3 shadow-inner">
                        <div
                            className={`${getUsageColor(AIusage)} h-3 rounded-full shadow-md transition-all duration-500`}
                            style={{ width: `${AIusage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileInformation;
