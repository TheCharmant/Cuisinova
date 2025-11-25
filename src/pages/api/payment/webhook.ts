import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/user';
import paymongo from 'paymongo';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verify webhook signature (in production, implement proper signature verification)
        const event = req.body;

        // Handle payment success event
        if (event.type === 'checkout_session.payment.paid') {
            const checkoutSession = event.data;
            const { userId, plan, billingCycle, startDate, endDate } = checkoutSession.metadata;

            // Connect to database
            await connectDB();

            // Update user subscription
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    subscription: {
                        plan,
                        status: 'active',
                        startDate: new Date(startDate),
                        endDate: new Date(endDate)
                    },
                    $unset: {
                        'subscription.pendingPayment': 1
                    }
                },
                { new: true }
            );

            if (!updatedUser) {
                console.error('User not found for payment webhook:', userId);
                return res.status(404).json({ error: 'User not found' });
            }

            console.log(`Subscription activated for user ${userId}: ${plan} plan`);
        }

        res.status(200).json({ received: true });

    } catch (error) {
        console.error('Webhook processing failed:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};

export default handler;