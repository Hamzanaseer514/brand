'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store';

export default function FloatingCart() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  if (totalItems === 0) return null;

  return (
    <Link href="/cart">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-40 glass backdrop-blur-md p-4 rounded-full border border-luxury-gold/30 hover:border-luxury-gold transition-all cursor-pointer shadow-luxury-lg group"
      >
        <div className="relative">
          <ShoppingBag className="text-luxury-gold group-hover:scale-110 transition-transform" size={28} />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
          >
            {totalItems}
          </motion.span>
        </div>
      </motion.div>
    </Link>
  );
}
