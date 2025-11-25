import { useEffect, useState } from 'react';
import { DialogBackdrop, Dialog, DialogPanel } from '@headlessui/react';
import Image from 'next/image';
import { EllipsisVerticalIcon } from '@heroicons/react/16/solid'
import useActionPopover from '../Hooks/useActionPopover';
import RecipeCard from '../RecipeCard';
import Loading from '../Loading';
import { ActionPopover } from './ActionPopover';
import UserLink from '../UserLink';
import { formatDate } from '../../utils/utils';
import { ExtendedRecipe } from '../../types';
import { motion } from 'framer-motion';
import { useAudio } from '../../contexts/AudioContext';

interface RecipeDialogProps {
    isOpen: boolean;
    close: () => void;
    recipe: ExtendedRecipe | null;
    removeRecipe: ({ message, error }: { message: string, error: string }) => void;
    handleRecipeListUpdate: (r: ExtendedRecipe | null, deleteId?: string | undefined) => void
}

export default function RecipeDisplayModal({ isOpen, close, recipe, removeRecipe, handleRecipeListUpdate }: RecipeDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const updateRecipe = (audioLink: string) => {
        if (!recipe) return null
        handleRecipeListUpdate({
            ...recipe,
            audio: audioLink
        })
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
    } = useActionPopover(recipe, updateRecipe);

    const { stopAudio } = useAudio();

    useEffect(() => {
        // Stop audio playback when the modal is closed
        if (!isOpen) {
            stopAudio();
        }
    }, [isOpen, stopAudio]);

    const deleteAndRemoveRecipe = async () => {
        try {
            setIsLoading(true)
            const { message, error } = await handleDeleteRecipe();
            setIsLoading(false)
            removeRecipe({ message, error })
        } catch (error) {
            console.error(error)
        }
    }

    if (!recipe) return null;

    return (
        <>
            <Dialog open={isOpen} as="div" className="relative z-modal focus:outline-none" onClose={close}>
                <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-md" />
                <div className="fixed inset-0 z-overlay w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="w-full max-w-lg"
                        >
                            <DialogPanel
                                className="w-full rounded-3xl bg-coquette-cream p-6 shadow-lg border border-coquette-blush/20 overflow-hidden"
                                style={{ boxShadow: '0 20px 40px rgba(255, 182, 193, 0.15)' }}
                            >
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-start w-full mb-4">
                                        <motion.div
                                            className="flex items-center"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-coquette-blush/30 shadow-sm">
                                                <Image
                                                    className="h-full w-full object-cover"
                                                    src={
                                                        recipe.owner.image ||
                                                        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                                                    }
                                                    alt={`Profile-Picture-${recipe.owner.name}`}
                                                    width={40}
                                                    height={40}
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <motion.p
                                                    className="text-sm font-medium text-coquette-rose"
                                                    initial={{ y: -10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                                >
                                                    <UserLink
                                                        userId={recipe.owner._id}
                                                        name={recipe.owner.name}
                                                    />
                                                </motion.p>
                                                <motion.p
                                                    className="text-xs text-gray-500"
                                                    initial={{ y: 10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.4 }}
                                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                                >
                                                    {formatDate(recipe.createdAt)}
                                                </motion.p>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <ActionPopover
                                                handlers={{
                                            handleClone,
                                            handleCopy,
                                            closeDialog: close,
                                            handlePlayRecipe,
                                            deleteDialog: handleDeleteDialog,
                                            deleteRecipe: deleteAndRemoveRecipe,
                                        }}
                                        states={{
                                            hasAudio: Boolean(recipe.audio),
                                            isLoadingAudio,
                                            isPlayingAudio,
                                            linkCopied,
                                            isDeleteDialogOpen,
                                        }}
                                        data={{
                                            recipe,
                                            buttonType: <EllipsisVerticalIcon className="h-5 w-5 text-coquette-lavender" />,
                                        }}
                                    />
                                        </motion.div>
                                    </div>
                                    {
                                        isLoading ?
                                            <Loading />
                                            :
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                                                className="w-full p-2"
                                            >
                                                <RecipeCard recipe={recipe} selectedRecipes={[]} removeMargin />
                                            </motion.div>
                                    }
                                </div>
                            </DialogPanel>
                        </motion.div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
