import type { NextApiRequest, NextApiResponse } from 'next';
import { apiMiddleware } from '../../lib/apiMiddleware';
import { generateRecipe } from '../../lib/openai';
import recipeModel from '../../models/recipe';
import { connectDB } from '../../lib/mongodb';

/**
 * API handler for generating recipes based on provided ingredients and dietary preferences.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
    try {
        if (req.method === 'GET') {
            // Fetch recipes from the database
            await connectDB();
            const { page = 1, limit = 12, sortOption = 'recent', filterOption = 'all' } = req.query;
            const pageNum = parseInt(page as string, 10) || 1;
            const limitNum = parseInt(limit as string, 10) || 12;
            let sort: any = { createdAt: -1 };
            if (sortOption === 'popular') sort = { likedBy: -1 };
            // You can add more sort options as needed
            let query: any = {};
            if (filterOption === 'liked') {
                query.likedBy = { $in: [session.user.id] };
            } else if (filterOption === 'saved') {
                // Assuming saved is same as liked for now
                query.likedBy = { $in: [session.user.id] };
            }
            // For 'all', no additional query
            const recipes = await recipeModel.find(query)
                .sort(sort)
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .lean();
            const totalRecipes = await recipeModel.countDocuments(query);
            const totalPages = Math.ceil(totalRecipes / limitNum);
            return res.status(200).json({
                recipes,
                currentPage: pageNum,
                totalPages,
                totalRecipes,
                popularTags: [] // Placeholder, as not implemented
            });
        }

        // POST: Generate recipes using OpenAI API
        const { ingredients, dietaryPreferences } = req.body;
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ error: 'Ingredients are required' });
        }
        console.info('Generating recipes from OpenAI...');
        const response = await generateRecipe(ingredients, dietaryPreferences, session.user.id);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process request' });
    }
};

export default apiMiddleware(['GET', 'POST'], handler);