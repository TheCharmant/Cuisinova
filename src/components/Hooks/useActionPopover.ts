import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { call_api, playAudio } from '../../utils/utils';
import { ExtendedRecipe } from '../../types';
import { useAudio } from '../../contexts/AudioContext';

function useActionPopover(recipe: ExtendedRecipe | null, updateRecipe: (audioLink: string) => void) {
    const [linkCopied, setLinkCopied] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const router = useRouter();
    const {
        playRecipe,
        stopAudio,
        isLoading: isLoadingAudio,
        isPlaying: isPlayingAudio,
        currentRecipe
    } = useAudio();

    useEffect(() => {
        // Stop audio when navigating away
        const handleRouteChange = () => {
            stopAudio();
        };

        router.events.on('routeChangeStart', handleRouteChange);
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router.events, stopAudio]);

    const handleClone = () => {
        router.push({
            pathname: '/CreateRecipe',
            query: {
                oldIngredients: recipe?.ingredients.map((i) => i.name),
            },
        });
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                `${window.location.origin}/RecipeDetail?recipeId=${recipe?._id}`
            );
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleDeleteDialog = () => setIsDeleteDialogOpen((prevState) => !prevState)


    const handlePlayRecipe = async () => {
        try {
            if (!recipe) return;

            // If currently playing this recipe, stop it
            if (isPlayingAudio && currentRecipe?._id === recipe._id) {
                stopAudio();
                return;
            }

            // If recipe has audio, play it directly
            if (recipe.audio) {
                await playRecipe(recipe, recipe.audio);
                return;
            }

            // Generate audio first
            const response = await call_api({
                address: '/api/tts',
                method: 'post',
                payload: { recipeId: recipe._id },
            });
            
            // Update the recipe with the new audio link
            updateRecipe(response.audio);
            
            // Play the newly generated audio
            await playRecipe(recipe, response.audio);
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    const handleDeleteRecipe = async () => {
        try {
            const response = await call_api({
                address: `/api/delete-recipe?recipeId=${recipe?._id}`,
                method: 'delete'
            })
            return response;
        } catch (error) {
            console.error(error)
        }
    }

    return {
        handleClone,
        handleCopy,
        handlePlayRecipe,
        handleDeleteDialog,
        handleDeleteRecipe,
        linkCopied,
        isLoadingAudio,
        isPlayingAudio: isPlayingAudio && currentRecipe?._id === recipe?._id,
        isDeleteDialogOpen
    };
}

export default useActionPopover;