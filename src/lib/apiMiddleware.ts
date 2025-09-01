import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth]';

/**
 * Middleware to handle HTTP method validation and authentication
 * @param allowedMethods - Array of allowed HTTP methods (e.g., ['POST'])
 * @param handler - The API route handler function
 */
export function apiMiddleware(allowedMethods: string[], handler: (req: NextApiRequest, res: NextApiResponse, session: any) => Promise<void>) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            // Validate HTTP method
            if (!allowedMethods.includes(req.method!)) {
                res.setHeader('Allow', allowedMethods);
                return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
            }

            // Authenticate the user
            console.log('Getting server session...');
            const session = await getServerSession(req, res, authOptions);
            console.log('Session retrieved:', session ? 'Valid session' : 'No session');
            if (session?.user) {
                console.log('Session user ID:', session.user.id);
            }
            if (!session) {
                console.log('No session found, returning 401');
                return res.status(401).json({ error: 'You must be logged in.' });
            }

            // Proceed with the actual handler
            await handler(req, res, session);
        } catch (error) {
            console.error('Middleware error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}
