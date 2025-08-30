import { useSession, getSession } from 'next-auth/react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Product from '../components/Hero_Sections/Product';
import Features from '../components/Hero_Sections/Features';
import Landing from '../components/Hero_Sections/Landing';
import ErrorPage from './auth/error';
import React from 'react';

// Navigation links for the header
const navigation = [
    { name: 'Product', key: 'product' },
    { name: 'Features', key: 'features' },
    { name: 'About', key: 'about' },
];

export default function Hero() {
    // State to manage the mobile menu open/close state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // State to manage the currently selected page
    const [selectedPage, setSelectedPage] = useState<string | null>(null);

    // Fetch the current session and status
    const { data: session, update } = useSession();

    // Function to render the content based on the selected page
    const renderContent = () => {
        switch (selectedPage) {
            case 'product':
                return (
                    <Product resetPage={() => setSelectedPage(null)} />
                );
            case 'features':
                return (
                    <Features resetPage={() => setSelectedPage(null)} />
                );
            case 'about':
                window.open('https://github.com/Dereje1/smart-recipe-generator', '_blank');
                setSelectedPage(null);
                return (
                    <Landing />
                );
            default:
                return (
                    <Landing />
                );
        }
    };

    // Ensures the user does not navigate to the sign-in page if a valid session exists.
    // If a session is already active, it updates the client state instead of prompting sign-in.
    // Otherwise, it initiates the sign-in process.

    const onAuthenticate = async () => {
        const sessionIsValid = await getSession()
        if (!sessionIsValid) {
            signIn('google')
            return
        }
        update()
    }

    // If the user is logged in, show the error page
    if (session) return <ErrorPage message='Inaccessible Page' />;

    return (
        <div className="bg-gradient-to-br from-brand-50 to-violet-50">
            {/* Header section */}
            <header className="absolute inset-x-0 top-0 z-header">
                <nav className="flex items-center justify-between p-6 lg:px-8 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Smart Recipe Generator</span>
                            <Image 
                                src="/logo.svg" 
                                alt="Smart Recipe Generator Logo" 
                                width={75} 
                                height={75} 
                                className="drop-shadow-lg"
                            />
                        </a>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-full p-2.5 text-violet-600 bg-white/90 shadow-md backdrop-blur-sm border border-violet-100 hover:scale-110 active:scale-90 hover:bg-white/95 transition-all"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navigation.map((item, index) => (
                            <button
                                key={item.key}
                                onClick={() => setSelectedPage(item.key)}
                                className={`text-base font-semibold leading-6 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${selectedPage === item.key ? 'text-white bg-gradient-to-r from-brand-500 to-violet-500 shadow-md' : 'text-gray-700 hover:text-brand-600'}`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <button
                            onClick={onAuthenticate}
                            className="text-base font-semibold leading-6 text-white bg-gradient-to-r from-brand-500 to-violet-500 hover:from-brand-600 hover:to-violet-600 px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                        >
                            Log in <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile menu dialog */}
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-modal" />
                <DialogPanel className="fixed inset-y-0 right-0 z-modal-top w-full overflow-y-auto bg-white/95 backdrop-blur-md px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Smart Recipe Generator</span>
                            <Image
                                src="/logo.svg"
                                alt="Smart Recipe Generator Logo"
                                width={50}
                                height={50}
                                className="drop-shadow-md"
                            />
                        </a>
                        <button
                            type="button"
                            className="-m-2.5 rounded-full p-2.5 text-gray-700 hover:bg-gray-100 hover:scale-110 active:scale-90 transition-all"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => {
                                            setSelectedPage(item.key);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`-mx-3 block w-full rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:scale-105 active:scale-95 transition-all ${selectedPage === item.key ? 'text-white bg-gradient-to-r from-brand-500 to-violet-500' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                            <div className="py-6">
                                <button
                                    onClick={() => {
                                        onAuthenticate();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="-mx-3 block w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-gradient-to-r from-brand-500 to-violet-500 hover:from-brand-600 hover:to-violet-600 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Log in
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>

            {/* Main content */}
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="mx-auto max-w-7xl py-32 sm:py-48 lg:py-56">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
