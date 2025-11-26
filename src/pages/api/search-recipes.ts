import type { NextApiRequest, NextApiResponse } from 'next';
import { apiMiddleware } from '../../lib/apiMiddleware';
import Recipe from '../../models/recipe';
import { connectDB } from '../../lib/mongodb';
import { filterResults, paginationQueryHelper } from '../../utils/utils';
import { ExtendedRecipe, PaginationQueryType } from '../../types';

/**
 * API handler for searching recipes (currently only by tags).
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @param session - The user session from `apiMiddleware`.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
    try {
        const { page, limit, skip, sortOption, filterOption, query } = paginationQueryHelper(req.query as unknown as PaginationQueryType)

        if (!query) {
            return res.status(400).json({ error: 'Search query (tag) is required' });
        }

        // Connect to the database
        await connectDB();

        // Search by tag, ingredient name, or recipe name
        let searchQuery: any = {
            $or: [
                { "tags.tag": { $regex: query, $options: "i" } },
                { "ingredients.name": { $regex: query, $options: "i" } },
                { name: { $regex: query, $options: "i" } }
            ]
        };

        // Apply filter
        if (filterOption === 'liked') {
            searchQuery.likedBy = { $in: [session.user.id] };
        } else if (filterOption === 'saved') {
            // Assuming saved is same as liked
            searchQuery.likedBy = { $in: [session.user.id] };
        }

        // Apply sort
        let sort: any = { createdAt: -1 };
        if (sortOption === 'popular') sort = { likedBy: -1 };

        // Execute both queries in parallel for efficiency
        const [recipes, popularTags, totalRecipes] = await Promise.all([
            // 🔹 Fetch paginated search results
            Recipe.find(searchQuery)
                .populate(['owner', 'likedBy', 'comments.user'])
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean() as unknown as ExtendedRecipe[],

            // 🔹 Fetch `popularTags` from the ENTIRE collection (not just filtered results)
            Recipe.aggregate([
                { $unwind: "$ingredients" },
                { $group: { _id: "$ingredients.name", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 20 }
            ]),

            // 🔹 Get total matching recipes (for pagination)
            Recipe.countDocuments(searchQuery),
        ]);

        return res.status(200).json({
            recipes: filterResults(recipes, session.user.id),
            totalRecipes,
            totalPages: Math.ceil(totalRecipes / limit),
            currentPage: page,
            popularTags, // ✅ Ensures consistent tag data across requests
        });

    } catch (error) {
        console.error('Error searching recipes by tags:', error);
        return res.status(500).json({ error: 'Failed to fetch search results' });
    }
};

// Apply middleware for authentication & allowed methods
export default apiMiddleware(['GET'], handler);
