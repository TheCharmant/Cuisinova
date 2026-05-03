import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Product from '../components/Hero_Sections/Product';
import Landing from '../components/Hero_Sections/Landing';
import ErrorPage from './auth/error';
import AnimatedBackground from '../components/AnimatedBackground';

const navigation = [
  { name: 'Home', key: 'home' },
  { name: 'Product', key: 'product' },
  { name: 'About us', key: 'about' },
];

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { data: session } = useSession();

  useEffect(() => {
    const sectionIds = ['home', 'product', 'about'];
    const handleScroll = () => {
      const current = sectionIds.find((id) => {
        const element = document.getElementById(id);
        if (!element) return false;
        return element.getBoundingClientRect().top <= window.innerHeight * 0.35;
      });
      if (current) setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const onAuthenticate = () => {
    signIn('google', { callbackUrl: '/Home' });
  };

  if (session) return <ErrorPage message='Inaccessible Page' />;

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(247,239,227,0.88),_rgba(232,221,205,0.98),_rgba(247,239,227,1)_70%)]">
      <AnimatedBackground />

      <header className="fixed inset-x-0 top-0 z-header border-b border-white/20 bg-white/30 backdrop-blur-xl shadow-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" onClick={() => scrollToSection('home')} className="flex items-center gap-3">
            <Image
              src="/cuisinova-logo.png"
              alt="Cuisinova Logo"
              width={52}
              height={52}
              className="rounded-full border border-white/80 bg-white/90 shadow-sm"
            />
            <span className="text-base font-semibold tracking-[0.15em] uppercase text-slate-900">Cuisinova</span>
          </a>

          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.key)}
                className={`text-sm font-semibold transition-all duration-300 rounded-full px-5 py-2 ${
                  activeSection === item.key
                    ? 'bg-white/90 text-slate-900 shadow-xl'
                    : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center">
            <button
              onClick={onAuthenticate}
              className="rounded-full bg-gradient-to-r from-brand-400 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Get started
            </button>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-white/90 p-2.5 text-slate-900 shadow-md transition-transform duration-200 hover:scale-105"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-modal bg-slate-900/20 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-y-0 right-0 z-modal-top w-full overflow-y-auto bg-white/95 px-6 py-6 shadow-xl sm:max-w-sm">
          <div className="flex items-center justify-between">
            <a href="#home" onClick={() => scrollToSection('home')} className="-m-1.5 p-1.5">
              <span className="sr-only">CUISINOVA</span>
              <Image src="/cuisinova-logo.png" alt="Cuisinova Logo" width={48} height={48} className="rounded-full" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-full p-2.5 text-slate-700 transition hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-8 space-y-4">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.key)}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-left text-base font-semibold text-slate-800 transition hover:-translate-y-0.5"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => {
                onAuthenticate();
                setMobileMenuOpen(false);
              }}
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-brand-400 to-violet-600 px-5 py-3 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              Get started
            </button>
          </div>
        </DialogPanel>
      </Dialog>

      <main className="relative scroll-smooth snap-y snap-mandatory">
        <div className="pt-28">
          <section id="home" className="snap-start min-h-screen px-4 py-10 md:px-6 lg:px-8">
            <Landing onGetStarted={onAuthenticate} />
          </section>
          <section id="product" className="snap-start min-h-screen bg-slate-50 px-4 py-16 md:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <p className="text-sm uppercase tracking-[0.35em] text-violet-700 font-semibold">Product</p>
                <h2 className="mt-5 text-4xl font-extrabold text-slate-950 sm:text-5xl">What Cuisinova Can Do</h2>
                <p className="mt-5 text-lg leading-8 text-slate-700 max-w-3xl mx-auto">Smart recipe creation, personalized dietary guidance, and a polished workflow designed for cooks who value time, precision, and professional results.</p>
              </div>
              <Product onGetStarted={onAuthenticate} />
            </div>
          </section>
          <section id="about" className="snap-start min-h-screen px-4 py-16 md:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <p className="text-sm uppercase tracking-[0.35em] text-violet-700 font-semibold">About us</p>
                <h2 className="mt-5 text-4xl font-extrabold text-slate-950 sm:text-5xl">Meet the team behind Cuisinova</h2>
                <p className="mt-5 text-lg leading-8 text-slate-700 max-w-3xl mx-auto">A focused team delivering AI-assisted recipe planning with the clarity and efficiency expected from a modern kitchen tool.</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200 bg-white/90 p-8 shadow-soft transition-transform duration-300 hover:-translate-y-1">
                  <div className="mb-6 flex items-center gap-4">
                    <Image src="/mocha.png" alt="CHARYLL" width={84} height={84} className="rounded-full object-cover" />
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-950">CHARYLL</h3>
                      <p className="text-sm text-slate-600">Full Stack Developer</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-slate-700 text-sm leading-7">
                    <li>Experienced in AI, cloud systems, and full-stack architecture.</li>
                    <li>Builds dependable solutions with a strong focus on usability.</li>
                    <li>Prizes clean engineering and polished product execution.</li>
                  </ul>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-white/90 p-8 shadow-soft transition-transform duration-300 hover:-translate-y-1">
                  <div className="mb-6 flex items-center gap-4">
                    <Image src="/vanilla.png" alt="GUI ANN" width={84} height={84} className="rounded-full object-cover" />
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-950">GUI ANN</h3>
                      <p className="text-sm text-slate-600">Concept & Design Lead</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-slate-700 text-sm leading-7">
                    <li>Designs interfaces that are expressive yet restrained and easy to navigate.</li>
                    <li>Focuses on modern usability with a professional presentation.</li>
                    <li>Creates polished experiences that make cooking feel well organized.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
