import { Switch, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Recipe } from '../types/index';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecipeCardProps {
    recipe: Recipe;
    handleRecipeSelection?: (id: string) => void;
    selectedRecipes: string[];
    showSwitch?: boolean;
    removeMargin?: boolean;
}

const RecipeCard = ({ recipe, handleRecipeSelection, selectedRecipes, showSwitch, removeMargin }: RecipeCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const parentClassName = `max-w-md mx-auto bg-cream-50/90 backdrop-blur-md shadow-pastel rounded-[2.5rem] overflow-hidden relative border-2 border-peach-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 kawaii-card ${removeMargin ? '' : 'mt-10 mb-5'}`;

    return (
        <motion.div 
            className={`${parentClassName} overflow-x-hidden`} 
            key={recipe.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
            <div className="px-8 py-6 relative">
                {/* Kawaii doodle accent */}
                <span className="absolute top-3 right-5 text-2xl opacity-40 select-none pointer-events-none">✨</span>

                {/* === Recipe Title and Optional Switch === */}
                <div className="flex justify-between items-stretch w-full mb-6">
                    {/* Recipe Name - Expandable Only If Switch Exists */}
                    <motion.div
                        className={`font-bold text-lg sm:text-xl lg:text-2xl 
                ${showSwitch && !isExpanded ? 'truncate max-w-[65%] sm:max-w-[75%] lg:max-w-[85%]' : 'w-full'}
                ${showSwitch ? 'cursor-pointer' : ''}
                bg-gradient-to-r from-brand-500 via-peach-400 to-violet-500 text-transparent bg-clip-text font-display kawaii-heading
            `}
                        onClick={() => showSwitch && setIsExpanded(!isExpanded)}
                        title={!showSwitch ? recipe.name : ''} // Tooltip for non-switch titles
                        whileHover={showSwitch ? { scale: 1.02 } : {}}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1, type: "spring" }}
                        style={{ fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}
                    >
                        <span className="mr-2">🍰</span>{recipe.name}
                    </motion.div>

                    {/* Optional Switch to Select Recipe */}
                    {showSwitch && (
                        <Switch
                            checked={selectedRecipes.includes(recipe.openaiPromptId)}
                            onChange={() =>
                                handleRecipeSelection ? handleRecipeSelection(recipe.openaiPromptId) : undefined
                            }
                            className={`
                relative inline-flex flex-shrink-0
                ${selectedRecipes.includes(recipe.openaiPromptId) ? 'bg-gradient-to-r from-brand-500 to-violet-500' : 'bg-violet-200'}
                h-[22px] w-[44px] sm:h-[30px] sm:w-[58px]
                cursor-pointer rounded-full border-2 border-transparent
                transition-colors duration-300 ease-in-out focus:outline-none shadow-md
            `}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={`
                    pointer-events-none inline-block
                    h-[18px] w-[18px] sm:h-[26px] sm:w-[26px]
                    ${selectedRecipes.includes(recipe.openaiPromptId) ? 'translate-x-5 sm:translate-x-7' : 'translate-x-0'}
                    transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out
                `}
                            />
                        </Switch>
                    )}
                </div>


                {/* === Ingredients Section === */}
                <motion.h3 
                    className="text-brand-600 font-semibold text-lg mb-3 font-display accent-script"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Ingredients:
                </motion.h3>
                <motion.ul 
                    className="mb-6 flex flex-wrap gap-2.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, staggerChildren: 0.05 }}
                >
                    {recipe.ingredients.map((ingredient, index) => (
                        <motion.li 
                            key={ingredient.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (index * 0.03) }}
                        >
                            <motion.span 
                                className="bg-peach-100 text-brand-600 text-sm font-medium px-4 py-1.5 rounded-full border-2 border-peach-200 shadow-pastel flex items-center gap-1 kawaii-chip"
                                whileHover={{ scale: 1.08, backgroundColor: "#fff7e6", boxShadow: "0 4px 12px 0 rgba(255,179,133,0.10)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-lg">🥕</span>{`${ingredient.name}${ingredient.quantity ? ` (${ingredient.quantity})` : ''}`}
                            </motion.span>
                        </motion.li>
                    ))}
                </motion.ul>

                {/* === Dietary Preferences === */}
                <motion.h3 
                    className="text-violet-600 font-semibold text-lg mb-3 font-display accent-script"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Dietary Preference:
                </motion.h3>
                <motion.div 
                    className="mb-6 flex flex-wrap gap-2.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, staggerChildren: 0.05 }}
                >
                    {recipe.dietaryPreference.map((preference, index) => (
                        <motion.span
                            key={preference}
                            className="bg-violet-100 text-violet-600 text-sm font-medium px-4 py-1.5 rounded-full border-2 border-violet-200 shadow-pastel flex items-center gap-1 kawaii-chip"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (index * 0.03) }}
                            whileHover={{ scale: 1.08, backgroundColor: "#ede9fe", boxShadow: "0 4px 12px 0 rgba(167,139,250,0.10)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-lg">💖</span>{preference}
                        </motion.span>
                    ))}
                </motion.div>

                {/* === Collapsible: Instructions === */}
                <Disclosure>
                    {({ open }) => (
                        <>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <DisclosureButton className="flex justify-between w-full px-5 py-3 text-lg font-semibold text-left text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl focus:outline-none shadow-lg transition-all duration-300">
                                    <span className="font-display">Instructions</span>
                                    <motion.div
                                        animate={{ rotate: open ? 180 : 0 }}
                                        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                                    >
                                        <ChevronDownIcon className="w-5 h-5" />
                                    </motion.div>
                                </DisclosureButton>
                            </motion.div>

                            <AnimatePresence>
                                {open && (
                                    <DisclosurePanel
                                        static
                                        as={motion.div}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="mt-3 px-5 pt-5 pb-3 text-sm leading-relaxed bg-gradient-to-r from-brand-50 to-white border border-brand-200 rounded-xl space-y-3 overflow-hidden shadow-inner"
                                    >
                                        <motion.ol 
                                            className="list-decimal ml-5 space-y-2"
                                            initial="hidden"
                                            animate="visible"
                                            variants={{
                                                visible: { transition: { staggerChildren: 0.05 } },
                                                hidden: {}
                                            }}
                                        >
                                            {recipe.instructions.map((instruction, idx) => (
                                                <motion.li 
                                                    key={idx}
                                                    variants={{
                                                        visible: { opacity: 1, y: 0 },
                                                        hidden: { opacity: 0, y: 10 }
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {instruction.replace(/^\d+\.\s*/, '')} {/* Remove any manual numbering */}
                                                </motion.li>
                                            ))}
                                        </motion.ol>
                                    </DisclosurePanel>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </Disclosure>

                {/* === Collapsible: Additional Information === */}
                <Disclosure as="div" className="mt-4">
                    {({ open }) => (
                        <>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <DisclosureButton className="flex justify-between w-full px-5 py-3 text-lg font-semibold text-left text-white bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl focus:outline-none shadow-lg transition-all duration-300">
                                    <span className="font-display">Additional Information</span>
                                    <motion.div
                                        animate={{ rotate: open ? 180 : 0 }}
                                        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                                    >
                                        <ChevronDownIcon className="w-5 h-5" />
                                    </motion.div>
                                </DisclosureButton>
                            </motion.div>

                            <AnimatePresence>
                                {open && (
                                    <DisclosurePanel
                                        static
                                        as={motion.div}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="mt-3 px-5 pt-5 pb-3 text-sm leading-relaxed bg-gradient-to-r from-violet-50 to-white border border-violet-200 rounded-xl space-y-3 overflow-hidden shadow-inner"
                                    >
                                        <motion.div 
                                            initial="hidden"
                                            animate="visible"
                                            variants={{
                                                visible: { transition: { staggerChildren: 0.1 } },
                                                hidden: {}
                                            }}
                                            className="space-y-3"
                                        >
                                            <motion.div 
                                                className="p-3 rounded-lg bg-white/70 backdrop-blur-sm shadow-sm border border-violet-100"
                                                variants={{
                                                    visible: { opacity: 1, y: 0 },
                                                    hidden: { opacity: 0, y: 10 }
                                                }}
                                            >
                                                <strong className="text-violet-600 font-medium">Tips:</strong> {recipe.additionalInformation.tips}
                                            </motion.div>
                                            <motion.div 
                                                className="p-3 rounded-lg bg-white/70 backdrop-blur-sm shadow-sm border border-violet-100"
                                                variants={{
                                                    visible: { opacity: 1, y: 0 },
                                                    hidden: { opacity: 0, y: 10 }
                                                }}
                                            >
                                                <strong className="text-violet-600 font-medium">Variations:</strong> {recipe.additionalInformation.variations}
                                            </motion.div>
                                            <motion.div 
                                                className="p-3 rounded-lg bg-white/70 backdrop-blur-sm shadow-sm border border-violet-100"
                                                variants={{
                                                    visible: { opacity: 1, y: 0 },
                                                    hidden: { opacity: 0, y: 10 }
                                                }}
                                            >
                                                <strong className="text-violet-600 font-medium">Serving Suggestions:</strong> {recipe.additionalInformation.servingSuggestions}
                                            </motion.div>
                                            <motion.div 
                                                className="p-3 rounded-lg bg-white/70 backdrop-blur-sm shadow-sm border border-violet-100"
                                                variants={{
                                                    visible: { opacity: 1, y: 0 },
                                                    hidden: { opacity: 0, y: 10 }
                                                }}
                                            >
                                                <strong className="text-violet-600 font-medium">Nutritional Information:</strong> {recipe.additionalInformation.nutritionalInformation}
                                            </motion.div>
                                        </motion.div>
                                    </DisclosurePanel>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </Disclosure>
            </div>
        </motion.div>
    );
};

export default RecipeCard;
