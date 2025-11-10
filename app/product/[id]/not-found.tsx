'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
          <h1 className="text-4xl font-bold text-luxury-ivory mb-4">Product Not Found</h1>
          <p className="text-luxury-ivory/60 mb-8 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the product you&apos;re looking for.
          </p>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black px-8 py-3 rounded-lg hover:shadow-luxury-lg transition-all font-semibold"
            >
              Browse All Products
            </motion.button>
          </Link>
      </motion.div>
    </div>
  );
}

