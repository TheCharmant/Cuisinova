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

        // Validate recipes array exists
        if (!Array.isArray(recipes) || recipes.length === 0) {
            console.error('No recipes provided or invalid format');
            return res.status(400).json({ error: 'No valid recipes provided' });
        }

        // Normalize recipes to ensure all required fields are present and correctly typed
        const normalizedRecipes = recipes.map((r: any) => {
            // Get list of valid ingredient names from original recipe (case-insensitive)
            const validIngredientNames = new Set(
                (r.ingredients || []).map((ing: any) => String(ing.name || '').trim().toLowerCase())
            );

            // Ensure ingredients have quantity as string and filter out any that aren't in the original list
            const ingredients = (r.ingredients || []).map((ing: any) => ({
                name: String(ing.name || '').trim(),
                quantity: typeof ing.quantity === 'string' ? ing.quantity.trim() : '',
            })).filter((ing: any) => 
                ing.name.length > 0 && 
                validIngredientNames.has(ing.name.toLowerCase())
            );

            // Ensure arrays exist
            const instructions = Array.isArray(r.instructions) ? r.instructions : [];
            const dietaryPreference = Array.isArray(r.dietaryPreference) ? r.dietaryPreference : [];
            const categories = Array.isArray(r.categories) ? r.categories : [];

            // Ensure additionalInformation fields are strings
            const additionalInformation = {
                tips: typeof r.additionalInformation?.tips === 'string' ? r.additionalInformation.tips : '',
                variations: typeof r.additionalInformation?.variations === 'string' ? r.additionalInformation.variations : '',
                servingSuggestions: typeof r.additionalInformation?.servingSuggestions === 'string' ? r.additionalInformation.servingSuggestions : '',
                nutritionalInformation: typeof r.additionalInformation?.nutritionalInformation === 'string' ? r.additionalInformation.nutritionalInformation : '',
            };

            return {
                ...r,
                ingredients,
                instructions,
                dietaryPreference,
                categories,
                additionalInformation,
                // Ensure openaiPromptId is string
                openaiPromptId: typeof r.openaiPromptId === 'string' ? r.openaiPromptId : '',
            };
        }).filter(r => r.name && r.ingredients.length > 0 && r.instructions.length > 0);

        if (normalizedRecipes.length === 0) {
            return res.status(400).json({ error: 'No valid recipes after normalization' });
        }

        // Generate images using OpenAI
        console.info('Getting images from OpenAI...');
        const imageResults = await generateImages(normalizedRecipes, session.user.id);
        console.info('OpenAI imageResults:', JSON.stringify(imageResults, null, 2));

        // Prepare images for uploading to S3
        const openaiImagesArray = imageResults.map((result, idx) => ({
            originalImgLink: result.imgLink,
            userId: session.user.id,
            location: normalizedRecipes[idx].openaiPromptId
        }));
        console.info('openaiImagesArray:', JSON.stringify(openaiImagesArray, null, 2));

        // Upload images to S3
        console.info('Uploading OpenAI images to S3...');
        const uploadResults = await uploadImagesToS3(openaiImagesArray);
        console.info('S3 uploadResults:', JSON.stringify(uploadResults, null, 2));

        // Update recipe data with image links and owner information
        const updatedRecipes = normalizedRecipes.map((r: any) => ({
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
        console.info(`Successfully saved ${normalizedRecipes.length} recipes to MongoDB`);
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