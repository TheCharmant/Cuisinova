import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { apiMiddleware } from '../../lib/apiMiddleware';
import { connectDB } from '../../lib/mongodb';
import Recipe from '../../models/recipe';
import { filterResults } from '../../utils/utils';
import { ExtendedRecipe } from '../../types';

/**
 * API handler for fetching recipes owned or liked by the user.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
    try {
        // Convert session user ID to a mongoose ObjectId
        const mongooseUserId = new mongoose.Types.ObjectId(session.user.id);

        // Connect to the database
        await connectDB();

        // Fetch recipes owned or liked by the user
        const profilePins = await Recipe.find({
            $or: [{ owner: mongooseUserId }, { likedBy: mongooseUserId }],
        })
            .populate(['owner', 'likedBy', 'comments.user'])
            .lean()
            .exec() as unknown as ExtendedRecipe[];

        // Count the number of recipes created by the user (AI generations = recipes created)
        const totalGeneratedCount = await Recipe.countDocuments({ owner: mongooseUserId }).exec();
        const apiRequestLimit = 10;
        const AIusage = Math.min(Math.round((totalGeneratedCount / apiRequestLimit) * 100), 100);
        // Filter results based on user session and respond with the filtered recipes
        const filteredRecipes = filterResults(profilePins, session.user.id);
        res.status(200).json({ recipes: filteredRecipes, AIusage, totalGeneratedCount, apiRequestLimit });
    } catch (error) {
        // Handle any errors that occur during fetching recipes
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
};

export default apiMiddleware(['GET'], handler);
