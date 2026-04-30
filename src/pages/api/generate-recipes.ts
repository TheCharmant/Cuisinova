import type { NextApiRequest, NextApiResponse } from 'next';
import { apiMiddleware } from '../../lib/apiMiddleware';
import { generateRecipe } from '../../lib/openai';

// Simple in-memory cache for recipe generation (key -> { result, timestamp })
const recipeCache = new Map<string, { result: any; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function generateCacheKey(ingredients: any[], categories: any[], dietaryPreferences: any[]): string {
    // Sort to ensure consistent ordering
    const sortedIngredients = [...ingredients].sort((a, b) => a.name.localeCompare(b.name));
    const sortedCategories = [...categories].sort();
    const sortedPreferences = [...dietaryPreferences].sort();
    return JSON.stringify({ ingredients: sortedIngredients, categories: sortedCategories, dietaryPreferences: sortedPreferences });
}

const handler = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
    try {
        // Extract ingredients, categories, and dietary preferences from request body
        const { ingredients, categories, dietaryPreferences } = req.body;

        // Validate ingredients input
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ error: 'Ingredients are required' });
        }

        // Enforce single-category selection (or none)
        if (categories && Array.isArray(categories) && categories.length > 1) {
            return res.status(400).json({ error: 'Select only one category' });
        }

        // Check cache first
        const cacheKey = generateCacheKey(ingredients, categories || [], dietaryPreferences || []);
        const cached = recipeCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
            console.info('Recipe generation cache hit');
            return res.status(200).json(cached.result);
        }

        // Generate recipes using OpenAI API
        console.info('Generating recipes from OpenAI...');
        const response = await generateRecipe(ingredients, categories || [], dietaryPreferences || [], session.user.id);

        // Cache the result
        recipeCache.set(cacheKey, { result: response, timestamp: Date.now() });

        // Respond with the generated recipes
        res.status(200).json(response);
    } catch (error) {
        // Handle any errors that occur during recipe generation
        console.error(error);
        res.status(500).json({ error: 'Failed to generate recipes' });
    }
};

export default apiMiddleware(['POST'], handler);
