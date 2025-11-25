import React, { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from './Header';
import Hero from '../pages/Hero';
import Loading from './Loading'
import ErrorPage from '../pages/auth/error';
import AnimatedBackground from './AnimatedBackground';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';

/* Note all components will be wrapped in this component which in turn is rendered by _app.tsx */
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { error: signinError } = router.query;
  
  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: cubicBezier(0.22, 1, 0.36, 1)
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.pathname]);

  if (signinError) {
    return <ErrorPage />
  }

  if (router.pathname === '/_error') {
    return <ErrorPage message="Page not found" />
  }

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'unauthenticated') {
    if (router.pathname === '/RecipeDetail') {
      signIn('google')
      return;
    }
    return <Hero />
  }

  if (session) {
    return (
      <div className="flex flex-col min-h-screen relative">
        {/* Decorative background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 text-4xl opacity-30 animate-float">✨</div>
            <div className="absolute top-40 right-16 text-3xl opacity-20 animate-bounceSparkle">💖</div>
            <div className="absolute bottom-32 left-20 text-2xl opacity-25 animate-float" style={{animationDelay: '2s'}}>🌸</div>
            <div className="absolute bottom-20 right-10 text-3xl opacity-20 animate-gentleGlow">🎀</div>
            <div className="absolute top-1/2 left-1/4 text-2xl opacity-15 animate-float" style={{animationDelay: '4s'}}>💕</div>
            <div className="absolute top-1/3 right-1/4 text-2xl opacity-20 animate-bounceSparkle" style={{animationDelay: '1s'}}>🌷</div>
        </div>
        <AnimatedBackground />
        <Header user={session.user} />
        <AnimatePresence mode="wait">
          <motion.main
            key={router.pathname}
            className="flex-grow w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    );
  }

  return <Loading />
};

export default Layout;
