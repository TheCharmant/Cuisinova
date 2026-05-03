import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Product from '../components/Hero_Sections/Product';
import Landing from '../components/Hero_Sections/Landing';
import ErrorPage from './auth/error';
import AnimatedBackground from '../components/AnimatedBackground';
import React from 'react';

// Navigation links for the header
const navigation = [
    { name: 'Home', key: 'home' },
    { name: 'Product', key: 'product' },
    { name: 'About us', key: 'about' },
];

export default function Hero() {
    // State to manage the mobile menu open/close state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Fetch the current session and status
    const { data: session } = useSession();

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (!element) return;
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Async sign-in handler with callback to the main app
    const onAuthenticate = () => {
        signIn('google', { callbackUrl: '/Home' });
    };
    // If the user is logged in, show the error page
    if (session) return <ErrorPage message='Inaccessible Page' />;

    return (
        <div className="min-h-screen relative overflow-x-hidden">
            <AnimatedBackground />
            {/* Header section */}
            <header className="absolute inset-x-0 top-0 z-header">
                <nav className="flex items-center justify-between p-6 lg:px-8 bg-white/20 backdrop-blur-md shadow-pastel border-b-2 border-white/30" aria-label="Global" style={{ fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}>
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">CUISINOVA</span>
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
                        {navigation.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => scrollToSection(item.key)}
                                className="text-lg font-bold leading-6 px-6 py-2 rounded-full transition-all duration-300 kawaii-nav text-brand-600 bg-white/80 border-2 border-peach-100 hover:bg-peach-100 hover:text-violet-600 hover:shadow-lg"
                                style={{ fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <button
                            onClick={onAuthenticate}
                            className="text-xl font-bold leading-6 text-white bg-gradient-to-r from-peach-300 via-brand-400 to-violet-400 hover:from-peach-400 hover:to-violet-500 px-8 py-3 rounded-full shadow-pastel hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 accent-script"
                            style={{ fontFamily: 'Pacifico, cursive' }}
                        >
                            Get started <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile menu dialog */}
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-modal" />
                <DialogPanel className="fixed inset-y-0 right-0 z-modal-top w-full overflow-y-auto bg-white/20 backdrop-blur-md px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/30 shadow-pastel">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">CUISINOVA</span>
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
                                            scrollToSection(item.key);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="-mx-3 block w-full rounded-lg px-3 py-2 text-lg font-bold leading-7 hover:scale-110 active:scale-95 transition-all kawaii-nav text-brand-600 bg-white/80 border-2 border-peach-100 hover:bg-peach-100 hover:text-violet-600 hover:shadow-lg"
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
                                    Get started
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>

            {/* Main content */}
            <div className="relative isolate px-4 pt-6 lg:px-6">
                <div className="mx-auto max-w-7xl py-10 sm:py-16 lg:py-20">
                    <section id="home" className="scroll-mt-28 px-4 py-10 md:px-0">
                        <Landing onGetStarted={onAuthenticate} />
                    </section>
                    <section id="product" className="scroll-mt-28 px-4 py-16 md:px-0 bg-slate-50">
                        <div className="text-center mb-10">
                            <p className="text-sm uppercase tracking-[0.4em] text-violet-700 font-semibold">Product</p>
                            <h2 className="mt-4 text-4xl font-extrabold text-slate-900">What Cuisinova Can Do</h2>
                            <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">Smart recipe creation, personalized dietary guidance, and a polished workflow designed for cooks who value time, precision, and professional results.</p>
                        </div>
                        <Product onGetStarted={onAuthenticate} />
                    </section>
                    <section id="about" className="scroll-mt-28 px-4 py-16 md:px-0">
                        <div className="text-center mb-10">
                            <p className="text-sm uppercase tracking-[0.4em] text-violet-700 font-semibold">About us</p>
                            <h2 className="mt-4 text-4xl font-extrabold text-slate-900">Meet the team behind Cuisinova</h2>
                            <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">A focused team delivering AI-assisted recipe planning with the clarity and efficiency expected from a modern kitchen tool.</p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                            <div className="flex flex-col items-center bg-white border border-slate-200 shadow-sm p-8 max-w-sm mx-auto rounded-sm">
                                <Image src="/mocha.png" alt="CHARYLL" width={96} height={96} className="rounded-full mb-5 object-cover" />
                                <h3 className="text-2xl font-semibold text-slate-900 mb-1">CHARYLL</h3>
                                <p className="text-sm text-slate-600 mb-4">Full Stack Developer</p>
                                <ul className="space-y-3 text-left text-slate-700 text-sm">
                                    <li>Experienced in AI, cloud systems, and full-stack architecture.</li>
                                    <li>Builds dependable solutions with a strong focus on usability.</li>
                                    <li>Prizes clean engineering and polished product execution.</li>
                                </ul>
                            </div>
                            <div className="flex flex-col items-center bg-white border border-slate-200 shadow-sm p-8 max-w-sm mx-auto rounded-sm">
                                <Image src="/vanilla.png" alt="GUI ANN" width={96} height={96} className="rounded-full mb-5 object-cover" />
                                <h3 className="text-2xl font-semibold text-slate-900 mb-1">GUI ANN</h3>
                                <p className="text-sm text-slate-600 mb-4">Concept & Design Lead</p>
                                <ul className="space-y-3 text-left text-slate-700 text-sm">
                                    <li>Designs interfaces that are expressive yet restrained and easy to navigate.</li>
                                    <li>Focuses on modern usability with a professional presentation.</li>
                                    <li>Creates polished experiences that make cooking feel well organized.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
