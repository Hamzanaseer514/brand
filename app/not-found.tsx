'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
          <h1 className="text-9xl font-bold text-luxury-gold mb-4">404</h1>
          <h2 className="text-3xl font-bold text-luxury-ivory mb-4">Page Not Found</h2>
          <p className="text-luxury-ivory/60 mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is
            temporarily unavailable.
          </p>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black px-8 py-3 rounded-lg hover:shadow-luxury-lg transition-all font-semibold"
            >
              Go Back Home
            </motion.button>
          </Link>
      </motion.div>
    </div>
  );
}

