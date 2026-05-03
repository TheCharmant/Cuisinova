import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/30 bg-white/20 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <p className="text-center text-sm text-slate-700 sm:text-left">
            © 2026 Cuisinova. All Rights Reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Follow us</span>
            <motion.a
              href="https://www.facebook.com/cuisinova.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white/80 p-3 text-slate-900 shadow-soft transition-colors duration-200 hover:bg-white"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
