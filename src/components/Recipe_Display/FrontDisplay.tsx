import React from 'react'
import Image from "next/image"
import { Button } from '@headlessui/react'
import { HandThumbUpIcon } from '@heroicons/react/24/outline'
import { HandThumbUpIcon as HandThumbUpSolid, ArrowRightCircleIcon } from '@heroicons/react/24/solid'
import { call_api } from "../../utils/utils";
import { ExtendedRecipe } from '../../types';
import { motion } from 'framer-motion';


interface FrontDisplayProps {
    recipe: ExtendedRecipe
    showRecipe: (recipe: ExtendedRecipe) => void
    updateRecipeList: (recipe: ExtendedRecipe) => void
}

const getThumbsup = ({ liked, owns }: { liked: boolean, owns: boolean }) => {
    if (owns) {
        return <HandThumbUpSolid className="block h-6 w-6 text-gray-500" />
    }
    if (liked) {
        return <HandThumbUpSolid className="block h-6 w-6 text-violet-500" />
    }
    return <HandThumbUpIcon className="block h-6 w-6 text-violet-500" />
}


const FrontDisplay = React.forwardRef<HTMLDivElement, FrontDisplayProps>(
    ({ recipe, showRecipe, updateRecipeList }, ref) => {

    const handleRecipeLike = async (recipeId: string) => {
        try {
            const result = await call_api({ address: '/api/like-recipe', method: 'put', payload: { recipeId } })
            updateRecipeList(result);
        } catch (error) {
            console.log(error)
        }
    }

    const isNew = new Date().getTime() - new Date(recipe.createdAt).getTime() < 24 * 60 * 60 * 1000; // 24 hours in ms

    return (
        <div ref={ref} className="recipe-card max-w-sm bg-white rounded-2xl shadow-sm mt-4 mb-2 flex flex-col h-full overflow-hidden border border-gray-100">
            <div className="relative w-full h-64 overflow-hidden">
                <Image
                    src={recipe.imgLink}
                    fill
                    alt={recipe.name}
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-2xl hover:scale-105 transition-transform duration-500"
                    priority
                    sizes="auto"
                />
                {isNew && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-400 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        NEW
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <motion.button
                        className="bg-white/90 backdrop-blur-sm text-gray-700 font-medium px-4 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2"
                        onClick={() => showRecipe(recipe)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Preview Recipe
                        <ArrowRightCircleIcon className="h-4 w-4" />
                    </motion.button>
                </div>
            </div>
            <div className="p-5 flex-grow">
                <h5 className="mb-2 text-xl font-semibold text-gray-900 text-center font-sans leading-tight">{recipe.name}</h5>
                <p className="font-normal text-gray-500 text-sm text-center leading-relaxed">{recipe.additionalInformation.nutritionalInformation}</p>
            </div>
            <div className="px-5 flex flex-wrap gap-2 mb-4 justify-center">
                {
                    recipe.dietaryPreference.map((preference) => (
                        <motion.span
                            key={preference}
                            className="bg-purple-50 text-purple-600 text-xs font-medium px-3 py-1 rounded-full border border-purple-100"
                            whileHover={{ scale: 1.05, backgroundColor: "#faf5ff" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {preference}
                        </motion.span>
                    ))
                }
            </div>
            <div className="p-5 pt-0">
                <div className="flex items-center justify-between">
                    <motion.button
                        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-purple-500 rounded-full shadow-sm focus:ring-2 focus:outline-none focus:ring-purple-300 hover:bg-purple-600"
                        onClick={() => showRecipe(recipe)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        See Recipe
                        <ArrowRightCircleIcon className="block ml-2 h-4 w-4" />
                    </motion.button>
                    <motion.button
                        className="py-2 px-4 text-purple-600 text-center border border-purple-200 rounded-full flex items-center gap-2 bg-purple-50 hover:bg-purple-100"
                        onClick={() => handleRecipeLike(recipe._id)}
                        disabled={recipe.owns}
                        data-testid="like_button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {getThumbsup(recipe)}
                        <span className="font-medium text-sm">{recipe.likedBy.length}</span>
                    </motion.button>
                </div>
            </div>
        </div>

    )
    }
)
FrontDisplay.displayName = 'FrontDisplay'

export default FrontDisplay


