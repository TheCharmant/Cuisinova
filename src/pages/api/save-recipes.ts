import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { generateImages, generateRecipeTags } from '../../lib/openai';
import { uploadImagesToS3 } from '../../lib/awss3';
import { apiMiddleware } from '../../lib/apiMiddleware';
import { connectDB } from '../../lib/mongodb';
import recipe from '../../models/recipe';
import { Recipe, UploadReturnType, ExtendedRecipe } from '../../types';

/**
 * Helper function to get the S3 link for an uploaded image.
 * @param uploadResults - The results of the S3 upload operation.
 * @param location - The location identifier for the image.
 * @returns The URL of the image in S3 or a fallback image URL.
 */
const getS3Link = (uploadResults: UploadReturnType[] | null, location: string) => {
    const fallbackImg = '/logo.svg';
    if (!uploadResults) return fallbackImg;
    const filteredResult = uploadResults.filter(result => result.location && result.location.endsWith(`/${location}`));
    if (filteredResult[0]?.uploaded) {
        return filteredResult[0].location;
    }
    return fallbackImg;
};

const getRecipeSaveKey = (recipe: Recipe) => recipe.openaiPromptId;

const summarizeImageResults = (imageResults: { imgLink?: string; name: string }[]) => (
    imageResults.map((result) => ({
        name: result.name,
        hasImage: Boolean(result.imgLink),
        imageSource: result.imgLink?.startsWith('data:image/') ? 'base64' : 'url',
        imageLength: result.imgLink?.length ?? 0,
    }))
);

const generateTagsAfterResponse = (savedRecipes: ExtendedRecipe[], userId: string) => {
    setTimeout(() => {
        savedRecipes.forEach((r) => {
            generateRecipeTags(r, userId)
                .catch((error) => console.error(`Failed to generate tags for recipe ${r.name}:`, error));
        });
    }, 0);
};

const generateImagesAfterResponse = async (
    savedRecipes: ExtendedRecipe[],
    sourceRecipes: Recipe[],
    userId: string
) => {
    try {
        console.info('Generating images for saved recipes...');
        const imageResults = await generateImages(sourceRecipes, userId);
        console.info('OpenAI imageResults summary:', summarizeImageResults(imageResults));

        const openaiImagesArray = imageResults.map((result, idx) => ({
            originalImgLink: result.imgLink,
            userId,
            location: sourceRecipes[idx].openaiPromptId
        }));
        console.info('Prepared image upload count:', openaiImagesArray.length);

        const uploadResults = await uploadImagesToS3(openaiImagesArray);
        console.info('S3 uploadResults:', JSON.stringify(uploadResults, null, 2));

        await Promise.all(savedRecipes.map((savedRecipe, idx) => {
            const sourceRecipe = sourceRecipes[idx];
            const openAiImg = imageResults[idx]?.imgLink || '/logo.svg';
            const s3Img = uploadResults?.[idx]?.uploaded ? getS3Link(uploadResults, sourceRecipe.openaiPromptId) : undefined;
            const displayUrl = s3Img || openAiImg;

            return recipe.findByIdAndUpdate(savedRecipe._id, {
                $set: {
                    imgLink: openAiImg,
                    imgDisplayUrl: displayUrl,
                },
            });
        }));
    } catch (error) {
        console.error('Failed to generate images after recipe save:', error);
    }
};

/**
 * Validates a recipe object to ensure it has all required fields.
 * @param recipe - The recipe object to validate.
 * @returns True if valid, false otherwise.
 */
const validateRecipe = (recipe: Recipe): boolean => {
    if (!recipe.name || typeof recipe.name !== 'string' || recipe.name.trim() === '') return false;
    if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) return false;
    if (!Array.isArray(recipe.instructions) || recipe.instructions.length === 0) return false;
    if (!Array.isArray(recipe.dietaryPreference)) return false;
    if (!recipe.additionalInformation || typeof recipe.additionalInformation !== 'object') return false;
    if (!recipe.additionalInformation.tips || typeof recipe.additionalInformation.tips !== 'string') return false;
    if (!recipe.additionalInformation.variations || typeof recipe.additionalInformation.variations !== 'string') return false;
    if (!recipe.additionalInformation.servingSuggestions || typeof recipe.additionalInformation.servingSuggestions !== 'string') return false;
    if (!recipe.additionalInformation.nutritionalInformation || typeof recipe.additionalInformation.nutritionalInformation !== 'string') return false;
    if (!Array.isArray(recipe.categories)) return false;
    if (!recipe.openaiPromptId || typeof recipe.openaiPromptId !== 'string') return false;

    // Validate ingredients
    for (const ing of recipe.ingredients) {
        if (!ing.name || typeof ing.name !== 'string' || !ing.quantity || typeof ing.quantity !== 'string') return false;
    }

    // Validate instructions
    for (const inst of recipe.instructions) {
        if (typeof inst !== 'string' || inst.trim() === '') return false;
    }

    return true;
};

/**
 * API handler for generating images for recipes, uploading them to S3, and saving the recipes to MongoDB.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
    try {
        console.log('Save recipes API called');
        console.log('Session:', session ? 'Session exists' : 'No session');
        console.log('Session user:', session?.user ? 'User exists' : 'No user');
        console.log('Session user ID:', session?.user?.id);

        // Extract recipes from the request body
        const { recipes } = req.body;
        console.log('Recipes received:', recipes?.length || 0);

        if (!session?.user?.id) {
            console.error('No valid session or user ID found');
            return res.status(401).json({ error: 'Invalid session or user ID' });
        }

        // Validate recipes
        if (!Array.isArray(recipes) || recipes.length === 0) {
            console.error('No recipes provided or invalid format');
            return res.status(400).json({ error: 'No valid recipes provided' });
        }

        for (const recipe of recipes) {
            if (!validateRecipe(recipe)) {
                console.error('Invalid recipe data:', recipe);
                return res.status(400).json({ error: 'Invalid recipe data provided' });
            }
        }

        const ownerId = new mongoose.Types.ObjectId(session.user.id);
        const recipeSaveKeys = recipes.map(getRecipeSaveKey);

        await connectDB();
        const existingRecipes = await recipe.find({
            owner: ownerId,
            openaiPromptId: { $in: recipeSaveKeys },
        }).select('openaiPromptId').lean();
        const existingRecipeKeys = new Set(
            existingRecipes.map((existingRecipe) => String(existingRecipe.openaiPromptId))
        );
        const recipesToSave = recipes.filter((r: Recipe) => !existingRecipeKeys.has(getRecipeSaveKey(r)));

        if (!recipesToSave.length) {
            console.info('Save recipes request already processed; skipping duplicate insert.');
            return res.status(200).json({
                status: 'Recipes already saved.',
                savedCount: 0,
                skippedCount: recipes.length,
            });
        }

        // Save recipes first so image generation does not block the client at 90%.
        const updatedRecipes = recipesToSave.map((r: Recipe) => ({
            ...r,
            owner: ownerId,
            imgLink: '/logo.svg',
            imgDisplayUrl: '/logo.svg',
            openaiPromptId: getRecipeSaveKey(r),
        }));
        console.info('Prepared recipes for database insert:', updatedRecipes.map((r) => ({
            name: r.name,
            openaiPromptId: r.openaiPromptId,
            hasDisplayImage: Boolean(r.imgDisplayUrl),
        })));

        // Connect to MongoDB and save recipes
        console.log('Saving recipes...');
        let savedRecipes;
        try {
            savedRecipes = await recipe.insertMany(updatedRecipes);
            console.info(`Successfully saved ${savedRecipes.length} recipes to MongoDB`);
            console.log('Saved recipes IDs:', savedRecipes.map(r => r._id));
        } catch (dbError) {
            console.error('Failed to save recipes to MongoDB:', dbError);
            return res.status(500).json({
                error: 'Failed to save recipes to database',
                imageBackup: updatedRecipes.map((recipe) => ({
                    name: recipe.name,
                    imgDisplayUrl: recipe.imgDisplayUrl,
                })),
            });
        }

        // Respond with success message
        res.status(200).json({
            status: 'Saved Recipes and generated the Images!',
            savedCount: savedRecipes.length,
            skippedCount: recipes.length - savedRecipes.length,
        });

        const savedExtendedRecipes = savedRecipes as unknown as ExtendedRecipe[];
        // Run image and tag generation after the client has received the save response.
        void generateImagesAfterResponse(savedExtendedRecipes, recipesToSave, session.user.id);
        generateTagsAfterResponse(savedExtendedRecipes, session.user.id);
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Failed to send response:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message, stack: error.stack });
        } else {
            res.status(500).json({ error: 'Failed to save recipes', detail: error });
        }
    }
};

export default apiMiddleware(['POST'], handler);
