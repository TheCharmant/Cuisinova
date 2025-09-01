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
            case 'about':
                return (
                    <div className="flex flex-col items-center justify-center py-16">
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-brand-500 to-violet-500 bg-clip-text text-transparent font-display mb-2">Meet the Team</h1>
                        <h2 className="text-2xl font-bold text-peach-400 mb-8">Mocha &amp; Vanilla</h2>
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            {/* CHARYLL */}
                            <div className="flex flex-col items-center bg-white/80 rounded-2xl shadow-pastel p-8 border-2 border-peach-100 w-80 max-w-xs text-center">
                                <Image src="/mocha.png" alt="CHARYLL" width={96} height={96} className="w-24 h-24 rounded-full border-4 border-peach-200 shadow-lg mb-3 object-cover" />
                                <h2 className="text-2xl font-extrabold text-peach-500 mb-1 tracking-wide">CHARYLL</h2>
                                <div className="text-brand-600 font-semibold mb-2">Full Stack Developer</div>
                                <ul className="text-xs text-gray-400 text-center space-y-1 px-2 list-disc list-inside font-normal">
                                    <li>Computer Science student with a passion for AI, cloud systems, and full-stack development.</li>
                                    <li>Driven to turn ideas into real applications that are both functional and intelligently designed.</li>
                                    <li>Believes technology should not just work — it should also feel engaging, friendly, and inspiring.</li>
                                </ul>
                            </div>
                            {/* GUI ANN */}
                            <div className="flex flex-col items-center bg-white/80 rounded-2xl shadow-pastel p-8 border-2 border-peach-100 w-80 max-w-xs text-center">
                                <Image src="/vanilla.png" alt="GUI ANN" width={96} height={96} className="w-24 h-24 rounded-full border-4 border-violet-200 shadow-lg mb-3 object-cover" />
                                <h2 className="text-2xl font-extrabold text-violet-500 mb-1 tracking-wide">GUI ANN</h2>
                                <div className="text-brand-600 font-semibold mb-2">Concept &amp; Design Contributor</div>
                                <ul className="text-xs text-gray-400 text-center space-y-1 px-2 list-disc list-inside font-normal">
                                    <li>Provides the creative spark behind CUISINOVA’s concept and aesthetic direction.</li>
                                    <li>Focuses on shaping user-friendly designs that blend playfulness with usability.</li>
                                    <li>Ensures the app feels warm, approachable, and aligned with the vision of making cooking fun.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <Landing />
                );
        }
    };

    // Async sign-in handler (must be top-level, not inside renderContent)
    const onAuthenticate = async () => {
        const sessionIsValid = await getSession();
        if (!sessionIsValid) {
            signIn('google');
            return;
        }
        update();
    };
    // If the user is logged in, show the error page
    if (session) return <ErrorPage message='Inaccessible Page' />;

    return (
        <div className="bg-gradient-to-br from-cream-100 via-peach-100 to-violet-100 min-h-screen relative overflow-x-hidden">
            {/* Kawaii sparkles accent */}
            <span className="absolute left-10 top-10 text-4xl opacity-50 animate-bounceSparkle select-none pointer-events-none">✨</span>
            {/* Header section */}
            <header className="absolute inset-x-0 top-0 z-header">
                <nav className="flex items-center justify-between p-6 lg:px-8 bg-cream-100/90 backdrop-blur-md shadow-pastel border-b-2 border-peach-100" aria-label="Global" style={{ fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}>
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Smart Recipe Generator</span>
                            <Image 
                                src="/cuisinova-logo.png" 
                                alt="Cuisinova Logo" 
                                width={75} 
                                height={75} 
                                className="drop-shadow-lg border-4 border-peach-200 rounded-full bg-white"
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
                                className={`text-lg font-bold leading-6 px-6 py-2 rounded-full transition-all duration-300 kawaii-nav hover:scale-110 active:scale-95 ${selectedPage === item.key ? 'text-violet-700 bg-gradient-to-r from-peach-300 via-brand-300 to-violet-300 shadow-pastel ring-2 ring-peach-200' : 'text-brand-600 bg-white/80 border-2 border-peach-100 hover:bg-peach-100 hover:text-violet-600 hover:shadow-lg'}`}
                                style={{ fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}
                            >
                                <span className="mr-1">{index === 0 ? '🍰' : index === 1 ? '✨' : '💖'}</span>{item.name}
                            </button>
                        ))}
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <button
                            onClick={onAuthenticate}
                            className="text-xl font-bold leading-6 text-white bg-gradient-to-r from-peach-300 via-brand-400 to-violet-400 hover:from-peach-400 hover:to-violet-500 px-8 py-3 rounded-full shadow-pastel hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 accent-script"
                            style={{ fontFamily: 'Pacifico, cursive' }}
                        >
                            <span className="mr-2">💖</span>Get Cooking! <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile menu dialog */}
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-modal" />
                <DialogPanel className="fixed inset-y-0 right-0 z-modal-top w-full overflow-y-auto bg-cream-100/95 backdrop-blur-md px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-peach-100 shadow-pastel">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Smart Recipe Generator</span>
                            <Image
                                src="/cuisinova-logo.png"
                                alt="Cuisinova Logo"
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
                                        className={`-mx-3 block w-full rounded-lg px-3 py-2 text-lg font-bold leading-7 hover:scale-110 active:scale-95 transition-all kawaii-nav ${selectedPage === item.key ? 'text-violet-700 bg-gradient-to-r from-peach-300 via-brand-300 to-violet-300 ring-2 ring-peach-200 shadow-pastel' : 'text-brand-600 bg-white/80 border-2 border-peach-100 hover:bg-peach-100 hover:text-violet-600 hover:shadow-lg'}`}
                                        style={{ fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}
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
                                    className="-mx-3 block w-full rounded-lg px-3 py-2.5 text-xl font-bold leading-7 text-white bg-gradient-to-r from-peach-300 via-brand-400 to-violet-400 hover:from-peach-400 hover:to-violet-500 hover:scale-110 active:scale-95 transition-all accent-script"
                                    style={{ fontFamily: 'Pacifico, cursive' }}
                                >
                                    <span className="mr-2">💖</span>Get Cooking!
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>

            {/* Main content */}
            <div className="relative isolate px-4 pt-6 lg:px-6">
                <div className="mx-auto max-w-7xl py-10 sm:py-16 lg:py-20 flex flex-col items-center justify-center">
                    {/* No hero illustration, just content below */}
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
