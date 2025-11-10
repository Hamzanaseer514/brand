'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/lib/store';
import { useCartStore } from '@/lib/store';
import QuickViewModal from './QuickViewModal';

interface LuxuryProductListItemProps {
  product: Product;
}

export default function LuxuryProductListItem({ product }: LuxuryProductListItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-gradient-to-r from-luxury-charcoal to-luxury-black rounded-2xl overflow-hidden border border-luxury-gold/20 hover:border-luxury-gold/50 transition-all duration-500 shadow-glass hover:shadow-luxury-lg flex flex-col sm:flex-row"
      >
        {/* Image Container */}
        <Link href={`/product/${product.id}`} className="relative w-full sm:w-64 md:w-80 h-64 sm:h-48 md:h-56 bg-gradient-to-br from-luxury-gold/20 via-luxury-charcoal to-luxury-black overflow-hidden flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 relative z-10"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 320px, 400px"
            unoptimized
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {/* Fallback gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/30 via-luxury-gold/10 to-luxury-charcoal flex items-center justify-center z-0">
            <div className="text-center">
              <div className="w-24 h-24 bg-luxury-gold/20 rounded-full mb-3 mx-auto flex items-center justify-center">
                <span className="text-luxury-gold text-3xl">✨</span>
              </div>
              <p className="text-luxury-gold/60 text-xs font-serif">{product.name}</p>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <Link href={`/product/${product.id}`}>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-luxury-ivory mb-2 hover:text-luxury-gold transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`${
                      i < Math.floor(product.rating)
                        ? 'fill-luxury-gold text-luxury-gold'
                        : 'text-luxury-ivory/20'
                    }`}
                    size={16}
                  />
                ))}
              </div>
              <span className="text-sm text-luxury-ivory/50">
                {product.rating} ({product.reviewsCount})
              </span>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-luxury-ivory/70 mb-4 line-clamp-2 hidden sm:block">
              {product.description}
            </p>

            {/* Category & Type */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-xs text-luxury-gold">
                {product.category}
              </span>
              <span className="px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-xs text-luxury-gold">
                {product.fragranceType}
              </span>
            </div>
          </div>

          {/* Bottom Section - Price and Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-luxury-gold/10">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-luxury-gold">
              ${product.price}
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsQuickViewOpen(true)}
                className="p-2.5 sm:p-3 rounded-lg bg-luxury-gold/10 hover:bg-luxury-gold/20 border border-luxury-gold/30 hover:border-luxury-gold transition-all group"
              >
                <Eye className="text-luxury-gold group-hover:scale-110 transition-transform" size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addItem(product)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold rounded-lg hover:shadow-luxury transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <ShoppingBag size={18} />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Gold Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
          className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 via-transparent to-transparent pointer-events-none"
        />
      </motion.div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}

