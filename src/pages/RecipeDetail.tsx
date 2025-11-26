import { useRouter } from "next/router";
import Image from 'next/image';
import { HandThumbUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { EllipsisHorizontalIcon, HandThumbUpIcon as HandThumbUpSolid } from '@heroicons/react/16/solid'
import useActionPopover from "../components/Hooks/useActionPopover";
import { useRecipeData } from "../components/Hooks/useRecipeData";
import { ActionPopover } from "../components/Recipe_Display/ActionPopover";
import RecipeHeader from "../components/RecipeHeader";
import UserLink from "../components/UserLink";
import Loading from "../components/Loading";
import ErrorPage from "./auth/error";
import { call_api } from "../utils/utils";

const getThumbsup = ({ liked, owns }: { liked: boolean, owns: boolean }) => {
    const baseClass = "size-6";
    if (owns) {
        return <HandThumbUpSolid className={`${baseClass} text-gray-500`} />;
    }
    if (liked) {
        return <HandThumbUpSolid className={`${baseClass} text-violet-500`} />;
    }
    return <HandThumbUpIcon className={`${baseClass} text-violet-500`} />;
};

export default function RecipeDetail() {
    const router = useRouter();
    const { recipeId } = router.query as { recipeId?: string }; // Extract recipeId from the URL query parameters
    const { recipeData, loading, error, setRecipeData, setLoading } = useRecipeData(recipeId);


    const updateRecipe = (audioLink: string) => {
        setRecipeData((prevRecipdata) => {
            if (!prevRecipdata) return null; // Ensure we're not working with null

            return {
                ...prevRecipdata, // Keep all existing properties
                audio: audioLink, // Update only what's necessary
            };
        });
    }

    const handleRecipeLike = async (recipeId: string) => {
        try {
            const result = await call_api({ address: '/api/like-recipe', method: 'put', payload: { recipeId } })
            setRecipeData(result)
        } catch (error) {
            console.log(error)
        }
    }

    const {
        handleClone,
        handleCopy,
        handlePlayRecipe,
        handleDeleteDialog,
        handleDeleteRecipe,
        linkCopied,
        isPlayingAudio,
        isLoadingAudio,
        isDeleteDialogOpen
    } = useActionPopover(recipeData, updateRecipe);



    const deleteAndRemoveRecipe = async () => {
        try {
            setLoading(true)
            const { message, error } = await handleDeleteRecipe();
            setLoading(false)
            router.push('/')
        } catch (error) {
            console.error(error)
        }
    }

    // Render the ErrorPage component if recipeId is not present
    if (!recipeId) return <ErrorPage message="Invalid Recipe" />;
    // Render the Loading component while data is being fetched
    if (loading) return <Loading />;
    // Render the ErrorPage component if an error occurred during fetching
    if (error) return <ErrorPage message={error} />;
    // Render a fallback message if no recipe data is found
    if (!recipeData) return <ErrorPage message="No Recipe Data" />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-100 via-peach-100 to-violet-100 p-6 animate-fadeInUp relative overflow-x-hidden">
            {/* Recipe Card */}
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-peach-100 via-white to-violet-50 shadow-pastel rounded-[2.5rem] overflow-hidden border-2 border-peach-100 hover:shadow-2xl transition-all duration-300 kawaii-card">
                <RecipeHeader recipeData={recipeData} /> {/* Recipe header with image and title */}
                <div className="p-6">
                    <ActionPopover
                        handlers={{
                            handleClone,
                            handleCopy,
                            deleteDialog: handleDeleteDialog,
                            handlePlayRecipe,
                            deleteRecipe: deleteAndRemoveRecipe,
                        }}
                        states={{
                            hasAudio: Boolean(recipeData.audio),
                            isLoadingAudio,
                            isPlayingAudio,
                            linkCopied,
                            isDeleteDialogOpen,
                        }}
                        data={{
                            recipe: recipeData,
                            buttonType: <EllipsisHorizontalIcon className="h-5 w-5 text-gray-700" />
                        }}

                    />
                    {/* Ingredients */}
                    <div className="flex flex-col">
                        <div className="mb-4">
                        <h3 className="mb-2 text-xl font-bold accent-script">🍑 Ingredients</h3> {/* Section title */}
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2"> {/* Responsive grid layout */}
                                {recipeData.ingredients.map((ingredient) => (
                                    <li key={ingredient.name} className="flex items-center kawaii-chip"> {/* Ingredient item */}
                                        <CheckCircleIcon className="w-5 h-5 text-peach-400 mr-2 flex-shrink-0" /> {/* Icon next to ingredient */}
                                        <span className="text-brand-700 font-medium">
                                            <span className="mr-1">🥕</span>{ingredient.name}{ingredient.quantity && ` (${ingredient.quantity})`} {/* Ingredient name and quantity */}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>


                    {/* Instructions */}
                    <div className="mb-4">
                        <h3 className="mb-2 text-xl font-bold accent-script">📝 Instructions</h3> {/* Section title */}
                        <ol className="list-decimal list-inside space-y-4">
                            {recipeData.instructions.map((step, index) => (
                                <li key={index} className="flex items-start kawaii-bubble bg-peach-100/60 rounded-xl p-3 mb-2 shadow-pastel">
                                    <span className="font-bold text-peach-500 mr-3 text-lg">{index + 1}.</span>
                                    <p className="text-brand-700 font-medium"><span className="mr-1">✨</span>{step}</p>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Additional Information */}
                    <div className="mb-6">
                        <h3 className="mb-4 text-xl font-bold accent-script">💡 Additional Information</h3> {/* Section title */}
                        <div className="space-y-4">
                            <div className="bg-cream-100/80 rounded-xl p-4 shadow-pastel">
                                <h4 className="font-bold text-peach-500">Tips:</h4>
                                <p className="text-brand-700">{recipeData.additionalInformation.tips}</p>
                            </div>
                            <div className="bg-cream-100/80 rounded-xl p-4 shadow-pastel">
                                <h4 className="font-bold text-peach-500">Variations:</h4>
                                <p className="text-brand-700">{recipeData.additionalInformation.variations}</p>
                            </div>
                            <div className="bg-cream-100/80 rounded-xl p-4 shadow-pastel">
                                <h4 className="font-bold text-peach-500">Serving Suggestions:</h4>
                                <p className="text-brand-700">{recipeData.additionalInformation.servingSuggestions}</p>
                            </div>
                            <div className="bg-cream-100/80 rounded-xl p-4 shadow-pastel">
                                <h4 className="font-bold text-peach-500">Nutritional Information:</h4>
                                <p className="text-brand-700">{recipeData.additionalInformation.nutritionalInformation}</p>
                            </div>
                        </div>
                    </div>

                    {/* Liked By Section */}
                    <button
                        className="w-12 h-12 mb-3 ml-4 hover:text-peach-500 hover:scale-110 hover:shadow-pastel rounded-full flex items-center justify-center bg-white border-2 border-peach-100 kawaii-fab transition-all duration-300"
                        onClick={() => handleRecipeLike(recipeData._id)}
                        disabled={recipeData.owns}
                        data-testid="like_button"
                        style={{ fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}
                    >
                        {getThumbsup(recipeData)}
                    </button>
                    {/* Thumbs up icon */}
                    <div className="flex items-center mt-4">
                        <div className="flex flex-wrap items-center gap-3">
                            {recipeData.likedBy.map((user, idx) => (
                                <div key={user._id} className="flex items-center space-x-2 kawaii-chip bg-peach-100/60 rounded-full px-3 py-1 shadow-pastel">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-peach-200 shadow-pastel">
                                        <Image
                                            src={user.image}
                                            alt={user.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-full"
                                        />
                                    </div>
                                    <span className="text-brand-700 font-medium"><UserLink name={user.name} userId={user._id}/></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

