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

        // Generate images using OpenAI
        console.info('Getting images from OpenAI...');
        const imageResults = await generateImages(recipes, session.user.id);
        console.info('OpenAI imageResults:', JSON.stringify(imageResults, null, 2));

        // Prepare images for uploading to S3
        const openaiImagesArray = imageResults.map((result, idx) => ({
            originalImgLink: result.imgLink,
            userId: session.user.id,
            location: recipes[idx].openaiPromptId
        }));
        console.info('openaiImagesArray:', JSON.stringify(openaiImagesArray, null, 2));

        // Upload images to S3
        console.info('Uploading OpenAI images to S3...');
        const uploadResults = await uploadImagesToS3(openaiImagesArray);
        console.info('S3 uploadResults:', JSON.stringify(uploadResults, null, 2));

        // Update recipe data with image links and owner information
        const updatedRecipes = recipes.map((r: Recipe) => ({
            ...r,
            owner: new mongoose.Types.ObjectId(session.user.id),
            imgLink: getS3Link(uploadResults, r.openaiPromptId),
            openaiPromptId: r.openaiPromptId.split('-')[0] // Remove client key iteration
        }));
        console.info('updatedRecipes:', JSON.stringify(updatedRecipes, null, 2));

        // Connect to MongoDB and save recipes
        console.log('Connecting to database...');
        await connectDB();
        console.log('Database connected, saving recipes...');
        const savedRecipes = await recipe.insertMany(updatedRecipes);
        console.info(`Successfully saved ${recipes.length} recipes to MongoDB`);
        console.log('Saved recipes IDs:', savedRecipes.map(r => r._id));

        // Run `generateRecipeTags` asynchronously in the background
        savedRecipes.forEach((r) => {
            generateRecipeTags(r as unknown as ExtendedRecipe, session.user.id)
                .catch((error) => console.error(`Failed to generate tags for recipe ${r.name}:`, error));
        });

        // Respond with success message
        res.status(200).json({ status: 'Saved Recipes and generated the Images!' });
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