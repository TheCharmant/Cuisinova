import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ErrorPage({ message }: { message?: string }) {
    const router = useRouter();
    const { error } = router.query;

    let errorMessage = `An unexpected error: "${error}" occurred. Please try again later.`;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-violet-50 p-8 animate-fadeInUp">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-violet-600 bg-clip-text text-transparent">{message || 'Sign In Error'}</h1>
            <p className="text-red-500 mb-4">{message ? '' : errorMessage}</p>
            <Link href="/" className="mt-4 px-6 py-2 bg-gradient-to-r from-brand-500 to-violet-500 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                Go to Home
            </Link>
        </div>
    );
}
