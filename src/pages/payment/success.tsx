import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface SuccessPageProps {
    user: any;
}

function PaymentSuccess({ user }: SuccessPageProps) {
    const router = useRouter();
    const { session_id } = router.query;

    useEffect(() => {
        // Redirect to profile after showing success message
        const timer = setTimeout(() => {
            router.push('/Profile');
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-brand-50 to-violet-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-violet-100 mx-auto mt-20">
                <CheckCircleIcon className="block m-auto h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-violet-600 bg-clip-text text-transparent">
                    Payment Successful!
                </h2>
                <p className="text-violet-600 mb-6">
                    Welcome to your subscription! Your account has been upgraded and you now have access to premium features.
                </p>
                <div className="text-sm text-violet-500">
                    Redirecting to your profile in a few seconds...
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

    return {
        props: {
            user: session.user,
        },
    };
};

export default PaymentSuccess;