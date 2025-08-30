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

    return (
        <div ref={ref} className="recipe-card max-w-sm bg-white/90 backdrop-blur-sm border border-violet-200 rounded-3xl shadow-xl mt-4 mb-2 flex flex-col h-full overflow-hidden">
            <div className="relative w-full h-64 overflow-hidden"> 
                <Image
                    src={recipe.imgLink}
                    fill
                    alt={recipe.name}
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-3xl hover:scale-110 transition-transform duration-700"
                    priority
                    sizes="auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <motion.button
                        className="bg-white/80 backdrop-blur-sm text-violet-700 font-medium px-4 py-2 rounded-full shadow-lg border border-violet-100 flex items-center gap-2"
                        onClick={() => showRecipe(recipe)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Preview Recipe
                        <ArrowRightCircleIcon className="h-5 w-5" />
                    </motion.button>
                </div>
            </div>
            <div className="p-6 flex-grow">
                <h5 className="mb-3 text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-violet-600 font-display">{recipe.name}</h5>
                <p className="font-normal text-gray-600 text-sm">{recipe.additionalInformation.nutritionalInformation}</p>
            </div>
            <div className="px-6 flex flex-wrap gap-2 mb-4">
                {
                    recipe.dietaryPreference.map((preference) => (
                        <motion.span 
                            key={preference} 
                            className="chip bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1.5 rounded-full border border-violet-200 shadow-sm"
                            whileHover={{ scale: 1.1, backgroundColor: "#ede9fe" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {preference}
                        </motion.span>
                    ))
                }
            </div>
            <div className="p-6 pt-2 border-t border-violet-100">
                <div className="flex items-center justify-between">
                    <motion.button
                        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-gradient-to-r from-brand-500 to-violet-500 rounded-full shadow-lg focus:ring-4 focus:outline-none focus:ring-brand-300"
                        onClick={() => showRecipe(recipe)}
                        whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        See Recipe
                        <ArrowRightCircleIcon className="block ml-2 h-5 w-5" />
                    </motion.button>
                    <motion.button
                        className="py-2 px-4 text-violet-600 text-center border border-violet-200 rounded-full flex items-center gap-2 bg-violet-50"
                        onClick={() => handleRecipeLike(recipe._id)}
                        disabled={recipe.owns}
                        data-testid="like_button"
                        whileHover={{ scale: 1.05, backgroundColor: "#ede9fe" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {getThumbsup(recipe)}
                        <span className="font-medium">{recipe.likedBy.length}</span>
                    </motion.button>
                </div>
            </div>
        </div>

    )
    }
)
FrontDisplay.displayName = 'FrontDisplay'

export default FrontDisplay


