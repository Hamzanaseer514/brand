'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Star, Eye, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/store';
import { useCartStore } from '@/lib/store';
import QuickViewModal from './QuickViewModal';

interface LuxuryProductCardProps {
  product: Product;
}

export default function LuxuryProductCard({ product }: LuxuryProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative bg-gradient-to-b from-luxury-charcoal to-luxury-black rounded-2xl overflow-hidden border border-luxury-gold/20 hover:border-luxury-gold/50 transition-all duration-500 shadow-glass hover:shadow-luxury-lg"
      >
        {/* Image Container with Glass Effect */}
        <Link href={`/product/${product.id}`}>
          <div className="relative h-80 bg-gradient-to-br from-luxury-gold/20 via-luxury-charcoal to-luxury-black overflow-hidden glass-reflection">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-700 relative z-10 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
              onError={(e) => {
                // Fallback gradient if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* Fallback gradient background - shows behind image */}
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/30 via-luxury-gold/10 to-luxury-charcoal flex items-center justify-center z-0">
              <div className="text-center">
                <div className="w-32 h-32 bg-luxury-gold/20 rounded-full mb-4 mx-auto flex items-center justify-center">
                  <span className="text-luxury-gold text-4xl">✨</span>
                </div>
                <p className="text-luxury-gold/60 text-sm font-serif">{product.name}</p>
              </div>
            </div>
            
            {/* Gold Overlay on Hover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.3 : 0 }}
              className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 via-transparent to-luxury-gold/10"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="p-6">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-xl text-luxury-ivory mb-2 hover:text-luxury-gold transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-luxury-ivory/60 text-sm mb-4 line-clamp-2 font-light">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`${
                    i < Math.floor(product.rating ?? 0)
                      ? 'fill-luxury-gold text-luxury-gold'
                      : 'text-luxury-ivory/20'
                  }`}
                  size={14}
                />
              ))}
            </div>
            <span className="text-xs text-luxury-ivory/50">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-luxury-gold/10">
            <div className="flex flex-col">
              {product.discount && product.discount > 0 ? (
                <>
                  <span className="text-2xl font-serif font-semibold text-luxury-gold">
                    Rs {((product.price * (100 - product.discount)) / 100).toFixed(2)}
                  </span>
                  <span className="text-sm text-luxury-ivory/50 line-through">
                    Rs {product.price}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-serif font-semibold text-luxury-gold">
                  Rs {product.price}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowQuickView(true);
                }}
                className="p-3 rounded-full bg-luxury-gold/10 hover:bg-luxury-gold/20 border border-luxury-gold/30 hover:border-luxury-gold transition-all group"
              >
                <Eye className="text-luxury-gold group-hover:scale-110 transition-transform" size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => addItem(product)}
                className="p-3 rounded-full bg-luxury-gold/10 hover:bg-luxury-gold/20 border border-luxury-gold/30 hover:border-luxury-gold transition-all group"
              >
                <ShoppingBag className="text-luxury-gold group-hover:scale-110 transition-transform" size={20} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Gold Shimmer Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? [0, 0.3, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
          }}
        >
          <div className="absolute inset-0 shimmer bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}
