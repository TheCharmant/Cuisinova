import React from 'react';
import { Button } from '@headlessui/react';
import { useRouter } from 'next/router';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'

interface LimitReachedProps {
    message?: string;
    onAction?: () => void;
    actionText?: string;
    fullHeight?: boolean;
}

const LimitReached: React.FC<LimitReachedProps> = ({
    message = "You've reached your recipe creation limit.",
    onAction,
    actionText = "Go to Home",
    fullHeight = false,
}) => {
    const router = useRouter();

    const handleAction = () => {
        if (onAction) {
            onAction();
        } else {
            router.push('/');
        }
    };

    return (
        <div className={`flex flex-col items-center justify-top ${fullHeight ? 'min-h-screen' : 'h-full'} bg-gradient-to-r from-brand-50 to-violet-50 p-4 animate-fadeInUp`}>
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-violet-100 hover:shadow-2xl transition-all duration-300">
                {/* Icon */}
                <ExclamationCircleIcon className="block m-auto h-16 w-16 text-violet-500"/>
                {/* Title */}
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-brand-500 to-violet-600 bg-clip-text text-transparent">Limit Reached</h2>
                {/* Message */}
                <p className="text-violet-600 mb-6">{message}</p>
                {/* Action Button */}
                <Button
                    onClick={handleAction}
                    className="bg-gradient-to-r from-brand-500 to-violet-500 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                    {actionText}
                </Button>
            </div>
        </div>
    );
};

export default LimitReached;
