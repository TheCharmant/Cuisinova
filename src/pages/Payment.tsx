import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Button } from '@headlessui/react';
import { CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import Loading from '../components/Loading';
import { call_api } from '../utils/utils';

interface PaymentPageProps {
    plan: 'basic' | 'premium' | 'pro';
    user: any;
}

const planDetails = {
    basic: {
        name: 'Starter Plan',
        price: 149,
        yearlyPrice: 1499,
        description: 'Generate up to 30 recipes per month',
        features: ['Standard recipes', 'Nutrition facts', 'Meal suggestions', 'Email support']
    },
    premium: {
        name: 'Advanced Plan',
        price: 299,
        yearlyPrice: 2999,
        description: 'Unlimited recipe generation',
        features: [
            'Smart recipe recommendations',
            'Custom meal plans',
            'Save & organize favorites',
            'Priority email and chat support'
        ]
    },
    pro: {
        name: 'Professional Plan',
        price: 499,
        yearlyPrice: 4999,
        description: 'Unlimited recipes with team collaboration',
        features: [
            'AI-assisted recipe creation',
            'Nutrition tracking & grocery lists',
            'Downloadable recipe PDFs',
            'API access for developers',
            '24/7 priority support'
        ]
    }
};

function Payment({ plan, user }: PaymentPageProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('gcash');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const selectedPlan = planDetails[plan];
    const price = billingCycle === 'monthly' ? selectedPlan.price : selectedPlan.yearlyPrice;

    useEffect(() => {
        if (!plan || !planDetails[plan]) {
            router.push('/');
        }
    }, [plan, router]);

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const response = await call_api({
                address: '/api/payment/initiate',
                method: 'post',
                payload: {
                    plan,
                    billingCycle,
                    amount: price
                }
            });

            if (response.success && response.checkoutUrl) {
                // Redirect to PayMongo checkout page
                window.location.href = response.checkoutUrl;
            } else {
                throw new Error('Failed to initiate payment');
            }

        } catch (error) {
            console.error('Payment initiation failed:', error);
            setIsLoading(false);
            alert('Failed to initiate payment. Please try again.');
        }
    };

    const handleComplete = () => {
        router.push('/Profile');
    };

    if (!plan || !selectedPlan) {
        return <div>Invalid plan selected</div>;
    }

    if (paymentComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-brand-50 to-violet-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-violet-100">
                    <CheckCircleIcon className="block m-auto h-16 w-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-violet-600 bg-clip-text text-transparent">
                        Payment Successful!
                    </h2>
                    <p className="text-violet-600 mb-6">
                        Welcome to {selectedPlan.name}! Your subscription is now active.
                    </p>
                    <Button
                        onClick={handleComplete}
                        className="bg-gradient-to-r from-brand-500 to-violet-500 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    >
                        Continue to Profile
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
            <div className="w-full max-w-2xl mx-auto space-y-6 animate-fadeInUp">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold coquette-text text-center relative">
                        Complete Your Payment
                    </h1>
                    <p className="text-coquette-lavender coquette-body mt-2">Secure payment via PayMongo</p>
                </div>

                <div className="coquette-card p-6">
                    <div className="flex items-center mb-4">
                        <CreditCardIcon className="h-8 w-8 text-violet-500 mr-3" />
                        <h2 className="text-xl font-semibold text-violet-700">{selectedPlan.name}</h2>
                    </div>

                    <div className="mb-6">
                        <p className="text-violet-600 mb-2">{selectedPlan.description}</p>
                        <ul className="space-y-1 text-sm text-violet-600">
                            {selectedPlan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Billing Cycle Toggle */}
                    <div className="mb-6">
                        <div className="flex justify-center space-x-2 bg-violet-50 rounded-full p-1">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    billingCycle === 'monthly'
                                        ? 'bg-violet-500 text-white shadow-md'
                                        : 'text-violet-600 hover:bg-violet-100'
                                }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    billingCycle === 'yearly'
                                        ? 'bg-violet-500 text-white shadow-md'
                                        : 'text-violet-600 hover:bg-violet-100'
                                }`}
                            >
                                Yearly
                                <span className="ml-1 text-xs bg-green-500 text-white px-1 py-0.5 rounded">
                                    SAVE {plan === 'basic' ? '15%' : plan === 'premium' ? '20%' : '25%'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Price Display */}
                    <div className="text-center mb-6">
                        <p className="text-3xl font-bold text-violet-600">
                            ₱{price.toLocaleString()}
                            <span className="text-lg text-violet-500">
                                /{billingCycle === 'monthly' ? 'month' : 'year'}
                            </span>
                        </p>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-violet-700 mb-3">
                            Choose Payment Method
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {['gcash', 'card', 'paymaya', 'grab_pay'].map((method) => (
                                <div
                                    key={method}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                        selectedPaymentMethod === method
                                            ? 'border-violet-500 bg-violet-50'
                                            : 'border-violet-200 hover:border-violet-300'
                                    }`}
                                    onClick={() => setSelectedPaymentMethod(method)}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={selectedPaymentMethod === method}
                                            onChange={() => setSelectedPaymentMethod(method)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm font-medium capitalize">
                                            {method === 'gcash' ? 'GCash' :
                                             method === 'card' ? 'Credit/Debit Card' :
                                             method === 'paymaya' ? 'PayMaya' :
                                             'GrabPay'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Button */}
                    {isLoading ? (
                        <Loading isProgressBar isComplete={false} loadingType="saving" />
                    ) : (
                        <Button
                            onClick={handlePayment}
                            className="w-full bg-gradient-to-r from-violet-500 to-violet-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                            Proceed to Payment - ₱{price.toLocaleString()}
                        </Button>
                    )}

                    <p className="text-xs text-center text-violet-500 mt-4">
                        Secure payment powered by PayMongo. Your information is encrypted and protected.
                    </p>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const { plan } = context.query;
    const validPlans = ['basic', 'premium', 'pro'];

    if (!plan || !validPlans.includes(plan as string)) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {
            plan: plan as 'basic' | 'premium' | 'pro',
            user: session.user,
        },
    };
};

export default Payment;