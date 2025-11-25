import type { NextApiRequest, NextApiResponse } from 'next';
import { apiMiddleware } from '@/lib/apiMiddleware';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/user';
import paymongo from 'paymongo';

interface PaymentData {
    plan: 'basic' | 'premium' | 'pro';
    billingCycle: 'monthly' | 'yearly';
    gcashAccount: string;
    amount: number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
    try {
        const { plan, billingCycle, amount }: PaymentData = req.body;

        // Validate input
        if (!plan || !['basic', 'premium', 'pro'].includes(plan)) {
            return res.status(400).json({ error: 'Invalid plan selected' });
        }

        if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
            return res.status(400).json({ error: 'Invalid billing cycle' });
        }

        // Calculate subscription dates
        const startDate = new Date();
        const endDate = new Date(startDate);
        if (billingCycle === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        // Initialize PayMongo client
        const paymongoClient = paymongo(process.env.PAYMONGO_SECRET_KEY!, process.env.PAYMONGO_PUBLIC_KEY!);

        // Create payment intent with PayMongo
        const paymentIntent = await paymongoClient.paymentIntents.create({
            amount: amount * 100, // PayMongo expects amount in centavos (multiply by 100)
            currency: 'PHP',
            payment_method_allowed: ['card', 'gcash', 'paymaya', 'grab_pay'],
            description: `Cuisinova ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - ${billingCycle}`,
            metadata: {
                plan,
                billingCycle,
                userId: session.user.id,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            }
        });

        // Create checkout session for better UX
        const checkoutSession = await paymongoClient.checkout.create({
            payment_intent_id: paymentIntent.id,
            reference_number: `CUISINOVA-${Date.now()}`,
            description: `Cuisinova ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
            amount: amount * 100,
            currency: 'PHP',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?plan=${plan}`,
            metadata: {
                plan,
                billingCycle,
                userId: session.user.id
            }
        });

        // Connect to database
        await connectDB();

        // Store payment intent in user record temporarily
        await User.findByIdAndUpdate(
            session.user.id,
            {
                $set: {
                    'subscription.pendingPayment': {
                        paymentIntentId: paymentIntent.id,
                        checkoutSessionId: checkoutSession.id,
                        plan,
                        billingCycle,
                        amount,
                        startDate,
                        endDate
                    }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Payment initiated successfully',
            checkoutUrl: checkoutSession.checkout_url,
            paymentIntentId: paymentIntent.id,
            checkoutSessionId: checkoutSession.id
        });

    } catch (error) {
        console.error('Payment initiation failed:', error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
};

export default apiMiddleware(['POST'], handler);