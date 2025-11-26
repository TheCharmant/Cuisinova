
import { useState } from 'react';
import FrontDisplay from './FrontDisplay'
import Dialog from './Dialog'
import { ExtendedRecipe } from '../../types';
import { motion } from 'framer-motion';

interface ViewRecipesProps {
    recipes: ExtendedRecipe[]
    handleRecipeListUpdate: (r: ExtendedRecipe | null, deleteId?: string) => void
    lastRecipeRef?: React.RefObject<HTMLDivElement>
}
const initialDialogContents: ExtendedRecipe | null = null

function ViewRecipes({ recipes, handleRecipeListUpdate, lastRecipeRef }: ViewRecipesProps) {
    const [openDialog, setOpenDialog] = useState(initialDialogContents);

    const handleShowRecipe = (recipe: ExtendedRecipe) => {
        setOpenDialog(recipe)
    }
    const removeRecipe = async ({ message, error }:{message: string, error: string}) => {
        if (!openDialog) return;
        try {
            setOpenDialog(null)
            if (error) {
                throw new Error(error)
            }
            if (message) {
                handleRecipeListUpdate(null, openDialog._id)
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Animation variants for container and items
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    if (!recipes.length) return null;
    return (
        <>
            <motion.div 
                className="flex justify-center items-center w-full p-5 mb-3"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                    variants={containerVariants}
                >
                    {recipes.map((recipe, index) => (
                        <motion.div 
                            key={recipe._id}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <FrontDisplay
                                recipe={recipe}
                                showRecipe={handleShowRecipe}
                                updateRecipeList={handleRecipeListUpdate}
                                ref={index === recipes.length - 1 ? lastRecipeRef : undefined}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
            <Dialog
                isOpen={Boolean(openDialog)}
                close={() => setOpenDialog(null)}
                recipe={openDialog}
                removeRecipe={removeRecipe}
                handleRecipeListUpdate={(args)=>{
                    handleRecipeListUpdate(args)
                    setOpenDialog(args)
                }}
            />
        </>
    )
}

export default ViewRecipes;