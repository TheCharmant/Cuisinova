import React from 'react';
import { Button } from '@headlessui/react';
import { useRouter } from 'next/router';
import { LockClosedIcon } from '@heroicons/react/24/solid'

interface SubscriptionPlan {
  id: 'basic' | 'premium' | 'pro';
  name: string;
  access: string;
  features: string[];
  support: string;
  price: string;
}

interface LimitReachedProps {
  message?: string;
  onAction?: () => void;
  actionText?: string;
  fullHeight?: boolean;
}

const LimitReached: React.FC<LimitReachedProps> = ({
  message = "You've reached your recipe creation limit.",
  onAction,
  actionText = 'Go to Home',
  fullHeight = false
}) => {
  const router = useRouter();

  const handleAction = () => {
    if (onAction) onAction();
    else router.push('/');
  };

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Starter',
      access: 'Up to 30 recipes monthly',
      features: ['Standard recipes', 'Nutrition facts', 'Meal suggestions'],
      support: 'Email support',
      price: '₱149/mo · ₱1,499/yr'
    },
    {
      id: 'premium',
      name: 'Premium',
      access: 'Unlimited recipe generation',
      features: [
        'Smart recommendations',
        'Custom daily & weekly meal plans',
        'Save & organize favorites'
      ],
      support: 'Priority email & chat support',
      price: '₱299/mo · ₱2,999/yr'
    },
    {
      id: 'pro',
      name: 'Pro',
      access: 'Unlimited + 5-team collaboration',
      features: [
        'AI-assisted creation & editing',
        'Nutrition tracking & grocery export',
        'Downloadable recipe PDFs',
        'API access'
      ],
      support: '24/7 priority support',
      price: '₱499/mo · ₱4,999/yr'
    }
  ];

  const handlePlanSelect = (planId: 'basic' | 'premium' | 'pro') => {
    router.push(`/payment?plan=${planId}`);
  };

  return (
    <div className={`${fullHeight ? 'min-h-screen' : ''} bg-gradient-to-b from-white to-violet-50 px-6 py-12 flex justify-center items-start animate-fadeInUp`}>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-10 w-full max-w-4xl border border-violet-100">
        <div className="text-center mb-10">
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <LockClosedIcon className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-semibold mt-4 text-violet-700">Upgrade Your Plan</h2>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <p className="text-sm text-violet-500 mt-2 max-w-md mx-auto">You've reached the free plan limit of 10 recipes. Upgrade to continue creating without restrictions.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white/60 backdrop-blur ${'border-violet-200 hover:border-violet-400'}`}
              >
              <h3 className="text-lg font-semibold text-violet-700 mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{plan.access}</p>
              <ul className="text-sm space-y-2 text-gray-700 mb-4">
                {plan.features.map((f, idx) => (
                  <li key={idx}>• {f}</li>
                ))}
              </ul>
              <p className="font-semibold text-violet-600 mb-4">{plan.price}</p>
              <Button onClick={() => handlePlanSelect(plan.id)} className="w-full py-2 rounded-full text-white bg-violet-600 hover:bg-violet-700 transition">Choose Plan</Button>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleAction}
            className="px-8 py-3 rounded-full text-white bg-violet-500 hover:bg-violet-600 transition shadow-md"
          >
            {actionText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LimitReached;
