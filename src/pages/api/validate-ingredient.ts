import type { NextApiRequest, NextApiResponse } from 'next';
import { apiMiddleware } from '../../lib/apiMiddleware';
import { validateIngredient } from '../../lib/openai';
import { connectDB } from '../../lib/mongodb';
import Ingredient from '../../models/ingredient';
import mongoose from 'mongoose';

/**
 * API handler for validating and adding a new ingredient.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
    try {
        // Check for required environment variables
        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY is not configured');
            return res.status(500).json({ error: 'OpenAI API key not configured' });
        }

        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not configured');
            return res.status(500).json({ error: 'Database connection not configured' });
        }

        // Ensure database connection
        await connectDB();

        // Validate request body
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        // Extract ingredient name from the request body
        const { ingredientName } = req.body;

        // Validate session and user ID
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Invalid session or user ID' });
        }

        const userId = session.user.id;

        // Validate ingredient name input
        if (!ingredientName || typeof ingredientName !== 'string' || ingredientName.trim().length === 0) {
            return res.status(400).json({ error: 'Valid ingredient name is required' });
        }

        const trimmedIngredientName = ingredientName.trim();

        // Validate ingredient using OpenAI
        console.info('Validating ingredient from OpenAI...');
        const response = await validateIngredient(trimmedIngredientName, userId);
        
        if (!response) {
            return res.status(500).json({ error: 'Failed to get validation response from OpenAI' });
        }

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(response);
        } catch (parseError) {
            console.error('Failed to parse OpenAI response:', parseError);
            return res.status(500).json({ error: 'Invalid response format from validation service' });
        }

        if (!parsedResponse || typeof parsedResponse !== 'object') {
            return res.status(500).json({ error: 'Invalid validation response format' });
        }

        const formattedIngredientName = trimmedIngredientName[0].toUpperCase() + trimmedIngredientName.slice(1).toLowerCase();
        
        // Check if ingredient already exists
        const ingredientExists = await Ingredient.findOne({ name: formattedIngredientName });

        if (parsedResponse.isValid) {
            if (!ingredientExists) {
                // Create new ingredient if it does not exist
                const newIngredient = await Ingredient.create({
                    name: formattedIngredientName,
                    createdBy: new mongoose.Types.ObjectId(userId)
                });
                return res.status(200).json({
                    message: 'Success',
                    newIngredient,
                    suggested: Array.isArray(parsedResponse.possibleVariations) ? parsedResponse.possibleVariations : []
                });
            } else {
                // Respond with error if ingredient already exists
                return res.status(200).json({
                    message: 'Error: This ingredient already exists'
                });
            }
        } else {
            // Respond with invalid ingredient and possible variations
            return res.status(200).json({
                message: 'Invalid',
                suggested: Array.isArray(parsedResponse.possibleVariations) ? parsedResponse.possibleVariations : []
            });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Validate ingredient API error:', error);
        
        // Provide more specific error messages based on error type
        if (error instanceof mongoose.Error) {
            return res.status(500).json({ error: 'Database operation failed' });
        }
        
        if (error instanceof Error && error.message.includes('OpenAI')) {
            return res.status(500).json({ error: 'AI validation service unavailable' });
        }

        return res.status(500).json({ error: 'Failed to validate ingredient' });
    }
};

export default apiMiddleware(['POST'], handler);
