import type { NextApiRequest, NextApiResponse } from 'next';
import { apiMiddleware } from '../../lib/apiMiddleware';
import { connectDB } from '../../lib/mongodb';
import Ingredient from '../../models/ingredient';
import Recipe from '../../models/recipe';
import User from '../../models/user';
import { IngredientDocumentType } from '../../types';

// Define the possible shapes of the API response
type Data = IngredientDocumentType[] | {
    error: string
} | {
    [key: string]: any;
};

// Export the default async handler function for the API route
async function handler(req: NextApiRequest, res: NextApiResponse<Data>, session: any) {
    try {
        // Establish a connection to the MongoDB database
        await connectDB();

        // Check if user has reached the free plan limit of 10 recipes
        const userRecipeCount = await Recipe.countDocuments({ owner: session.user.id }).exec();

        // Check if user has an active subscription
        const user = await User.findById(session.user.id).exec();
        const hasActiveSubscription = user?.subscription?.status === 'active' &&
            new Date(user.subscription.endDate) > new Date();

        if (userRecipeCount >= 10 && !hasActiveSubscription) {
            res.status(200).json({
                reachedLimit: true,
                ingredientList: []
            });
            return;
        }

        // Retrieve all ingredients from the database, sorted alphabetically by name
        const allIngredients = await Ingredient.find().sort({ name: 1 }).exec() as unknown as IngredientDocumentType[];

        // Respond with the list of ingredients and reachedLimit flag as false
        res.status(200).json({
            reachedLimit: false,
            ingredientList: allIngredients
        });
    } catch (error) {
        // Log any errors to the server console for debugging
        console.error(error);

        // Respond with a 500 Internal Server Error and an error message
        res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
}
export default apiMiddleware(['GET'], handler);