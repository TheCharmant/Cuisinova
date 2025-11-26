import { Switch, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Recipe } from '../types/index';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface RecipeCardProps {
    recipe: Recipe & { imgLink?: string };
    handleRecipeSelection?: (id: string) => void;
    selectedRecipes: string[];
    showSwitch?: boolean;
    removeMargin?: boolean;
}

const RecipeCard = ({ recipe, handleRecipeSelection, selectedRecipes, showSwitch, removeMargin }: RecipeCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const parentClassName = `w-full bg-coquette-cream shadow-sm rounded-3xl overflow-hidden relative border border-coquette-blush/20 hover:shadow-md transition-all duration-300 ${removeMargin ? '' : 'mt-6 mb-4'} max-h-[70vh] flex flex-col`;

    return (
        <motion.div
            className={`${parentClassName} overflow-x-hidden`}
            key={recipe.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ boxShadow: "0 20px 40px rgba(247, 200, 208, 0.15)" }}
            style={{ boxShadow: '0 8px 24px rgba(247, 200, 208, 0.1)' }}
        >
            <div className="px-6 py-5 relative flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-coquette-blush scrollbar-track-coquette-cream">
                {/* Recipe Image Preview */}
                {recipe.imgLink && (
                    <motion.div
                        className="relative w-full h-48 mb-4 overflow-hidden rounded-2xl"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        style={{ boxShadow: '0 8px 24px rgba(247, 200, 208, 0.12)' }}
                    >
                        <Image
                            src={recipe.imgLink}
                            fill
                            alt={recipe.name}
                            style={{ objectFit: 'cover' }}
                            className="rounded-2xl"
                            priority
                            sizes="auto"
                        />
                    </motion.div>
                )}

                {/* === Recipe Title and Optional Switch === */}
                <div className="flex justify-between items-center w-full mb-5">
                    {/* Recipe Name - Expandable Only If Switch Exists */}
                    <motion.h2
                        className={`font-bold text-xl text-center text-coquette-rose font-serif leading-tight
                ${showSwitch && !isExpanded ? 'truncate max-w-[70%]' : 'w-full'}
                ${showSwitch ? 'cursor-pointer' : ''}
            `}
                        onClick={() => showSwitch && setIsExpanded(!isExpanded)}
                        title={!showSwitch ? recipe.name : ''} // Tooltip for non-switch titles
                        whileHover={showSwitch ? { scale: 1.02 } : {}}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1, type: "spring" }}
                        style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
                    >
                        {recipe.name} 💕
                    </motion.h2>

                    {/* Optional Switch to Select Recipe */}
                    {showSwitch && (
                        <Switch
                            checked={selectedRecipes.includes(recipe.openaiPromptId)}
                            onChange={() =>
                                handleRecipeSelection ? handleRecipeSelection(recipe.openaiPromptId) : undefined
                            }
                            className={`
                relative inline-flex flex-shrink-0
                ${selectedRecipes.includes(recipe.openaiPromptId) ? 'bg-gradient-to-r from-coquette-blush to-coquette-lavender' : 'bg-gray-200'}
                h-6 w-11
                cursor-pointer rounded-full border-2 border-transparent
                transition-colors duration-300 ease-in-out focus:outline-none shadow-sm
            `}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={`
                    pointer-events-none inline-block
                    h-5 w-5
                    ${selectedRecipes.includes(recipe.openaiPromptId) ? 'translate-x-5' : 'translate-x-0'}
                    transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out
                `}
                            />
                        </Switch>
                    )}
                </div>

                {/* === Ingredients Section === */}
                <motion.h3
                    className="text-coquette-lavender font-semibold text-base mb-3 font-sans"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    Ingredients
                </motion.h3>
                <motion.div
                    className="mb-5 flex flex-wrap gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, staggerChildren: 0.05 }}
                >
                    {recipe.ingredients.map((ingredient, index) => (
                        <motion.span
                            key={ingredient.name}
                            className="bg-coquette-blush/20 text-coquette-rose text-sm px-3 py-1.5 rounded-full border border-coquette-blush/30"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (index * 0.03) }}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(247, 200, 208, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            {`${ingredient.name}${ingredient.quantity ? ` (${ingredient.quantity})` : ''}`}
                        </motion.span>
                    ))}
                </motion.div>

                {/* === Categories === */}
                {recipe.categories && recipe.categories.length > 0 && (
                    <>
                        <motion.h3
                            className="text-coquette-lavender font-semibold text-base mb-3 font-sans"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Categories
                        </motion.h3>
                        <motion.div
                            className="mb-5 flex flex-wrap gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, staggerChildren: 0.05 }}
                        >
                            {recipe.categories.map((category, index) => (
                                <motion.span
                                    key={category}
                                    className="bg-coquette-lavender/20 text-coquette-rose text-sm px-3 py-1.5 rounded-full border border-coquette-lavender/30"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 + (index * 0.03) }}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(200, 184, 234, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    {category}
                                </motion.span>
                            ))}
                        </motion.div>
                    </>
                )}

                {/* === Dietary Preferences === */}
                {recipe.dietaryPreference && recipe.dietaryPreference.length > 0 && (
                    <>
                        <motion.h3
                            className="text-coquette-lavender font-semibold text-base mb-3 font-sans"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.45 }}
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Dietary Preference
                        </motion.h3>
                        <motion.div
                            className="mb-5 flex flex-wrap gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, staggerChildren: 0.05 }}
                        >
                            {recipe.dietaryPreference.map((preference, index) => (
                                <motion.span
                                    key={preference}
                                    className="bg-coquette-blush/20 text-coquette-rose text-sm px-3 py-1.5 rounded-full border border-coquette-blush/30"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.03) }}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(247, 200, 208, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    {preference}
                                </motion.span>
                            ))}
                        </motion.div>
                    </>
                )}

                {/* === Collapsible: Instructions === */}
                <Disclosure>
                    {({ open }) => (
                        <>
                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                <DisclosureButton className="flex justify-between w-full px-5 py-3 text-base font-medium text-left text-white rounded-3xl focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                                    style={{
                                        background: 'linear-gradient(90deg, #F7C8D0, #C8B8EA)',
                                        boxShadow: '0 4px 12px rgba(247, 200, 208, 0.3)'
                                    }}
                                >
                                    <span style={{ fontFamily: "'Poppins', sans-serif" }}>Instructions</span>
                                    <motion.div
                                        animate={{ rotate: open ? 180 : 0 }}
                                        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                                    >
                                        <ChevronDownIcon className="w-4 h-4" />
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
                                        className="mt-3 px-5 py-4 text-sm leading-relaxed bg-white border border-coquette-blush/20 rounded-2xl space-y-2 overflow-hidden"
                                        style={{ boxShadow: '0 8px 24px rgba(255, 182, 193, 0.08)' }}
                                    >
                                        <motion.ol
                                            className="list-decimal ml-4 space-y-2"
                                            initial="hidden"
                                            animate="visible"
                                            variants={{
                                                visible: { transition: { staggerChildren: 0.05 } },
                                                hidden: {}
                                            }}
                                            style={{ fontFamily: "'Poppins', sans-serif" }}
                                        >
                                            {recipe.instructions.map((instruction, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    className="text-gray-700"
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
                <Disclosure as="div" className="mt-3">
                    {({ open }) => (
                        <>
                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                <DisclosureButton className="flex justify-between w-full px-5 py-3 text-base font-medium text-left text-white rounded-3xl focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                                    style={{
                                        background: 'linear-gradient(90deg, #F7C8D0, #C8B8EA)',
                                        boxShadow: '0 4px 12px rgba(247, 200, 208, 0.3)'
                                    }}
                                >
                                    <span style={{ fontFamily: "'Poppins', sans-serif" }}>Additional Information</span>
                                    <motion.div
                                        animate={{ rotate: open ? 180 : 0 }}
                                        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                                    >
                                        <ChevronDownIcon className="w-4 h-4" />
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
                                        className="mt-3 px-5 py-4 text-sm leading-relaxed bg-white border border-coquette-blush/20 rounded-2xl space-y-3 overflow-hidden"
                                        style={{ boxShadow: '0 8px 24px rgba(255, 182, 193, 0.08)' }}
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
                                                className="p-4 rounded-xl bg-coquette-cream border border-coquette-blush/20"
                                                variants={{
                                                    visible: { opacity: 1, y: 0 },
                                                    hidden: { opacity: 0, y: 10 }
                                                }}
                                                style={{ boxShadow: '0 4px 12px rgba(255, 182, 193, 0.06)' }}
                                            >
                                                <strong className="text-coquette-lavender font-medium text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Tips:</strong> <span className="text-gray-700" style={{ fontFamily: "'Poppins', sans-serif" }}>{recipe.additionalInformation.tips}</span>
                                            </motion.div>
                                            <motion.div
                                                className="p-4 rounded-xl bg-coquette-cream border border-coquette-blush/20"
                                                variants={{
                                                    visible: { opacity: 1, y: 0 },
                                                    hidden: { opacity: 0, y: 10 }
                                                }}
                                                style={{ boxShadow: '0 4px 12px rgba(255, 182, 193, 0.06)' }}
                                            >
                                                <strong className="text-coquette-lavender font-medium text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Variations:</strong> <span className="text-gray-700" style={{ fontFamily: "'Poppins', sans-serif" }}>{recipe.additionalInformation.variations}</span>
                                            </motion.div>
                                            <motion.div
                                                className="p-4 rounded-xl bg-coquette-cream border border-coquette-blush/20"
                                                variants={{
                                                    visible: { opacity: 1, y: 0 },
                                                    hidden: { opacity: 0, y: 10 }
                                                }}
                                                style={{ boxShadow: '0 4px 12px rgba(255, 182, 193, 0.06)' }}
                                            >
                                                <strong className="text-coquette-lavender font-medium text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Serving Suggestions:</strong> <span className="text-gray-700" style={{ fontFamily: "'Poppins', sans-serif" }}>{recipe.additionalInformation.servingSuggestions}</span>
                                            </motion.div>
                                            <motion.div
                                                className="p-4 rounded-xl bg-coquette-cream border border-coquette-blush/20"
                                                variants={{
                                                    visible: { opacity: 1, y: 0 },
                                                    hidden: { opacity: 0, y: 10 }
                                                }}
                                                style={{ boxShadow: '0 4px 12px rgba(255, 182, 193, 0.06)' }}
                                            >
                                                <strong className="text-coquette-lavender font-medium text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Nutritional Information:</strong> <span className="text-gray-700" style={{ fontFamily: "'Poppins', sans-serif" }}>{recipe.additionalInformation.nutritionalInformation}</span>
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
