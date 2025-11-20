'use client';

import Image from 'next/image';
import { X, ShoppingBag, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/store';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-luxury-black/90 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onClose();
              }
            }}
          >
            <div className="relative bg-gradient-to-b from-luxury-charcoal to-luxury-black rounded-2xl border border-luxury-gold/30 shadow-luxury-lg overflow-hidden w-full max-w-[95vw] sm:max-w-3xl lg:max-w-5xl my-auto min-h-[50vh] max-h-[95vh] sm:max-h-[90vh] flex flex-col">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 glass backdrop-blur-md p-2 rounded-full border border-luxury-gold/30 hover:border-luxury-gold transition-colors"
              >
                <X className="text-luxury-gold" size={20} />
              </button>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
                {/* Image */}
                <div className="relative h-64 sm:h-80 md:h-[480px] bg-luxury-black rounded-xl overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    unoptimized
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between min-h-0">
                  <div className="flex-1 overflow-y-auto pr-2">
                    <h2 className="font-serif text-2xl sm:text-3xl text-luxury-ivory mb-3 sm:mb-4">
                      {product.name}
                    </h2>
                    
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`${
                              i < Math.floor(product.rating || 0)
                                ? 'fill-luxury-gold text-luxury-gold'
                                : 'text-luxury-ivory/20'
                            }`}
                            size={16}
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-luxury-ivory/50">
                        {product.rating || 0} ({product.reviewsCount || 0} reviews)
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-luxury-ivory/70 mb-4 sm:mb-6 leading-relaxed">
                      {product.description}
                    </p>

                    {product.fragranceNotes && product.fragranceNotes.length > 0 && (
                      <div className="mb-4 sm:mb-6">
                        <p className="text-xs sm:text-sm text-luxury-ivory/60 mb-2">Fragrance Notes:</p>
                        <div className="flex flex-wrap gap-2">
                          {product.fragranceNotes.slice(0, 4).map((note) => (
                            <span
                              key={note}
                              className="px-2 sm:px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-xs text-luxury-gold"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4 sm:mb-6 pt-4 sm:pt-6 border-t border-luxury-gold/10">
                      {product.discount && product.discount > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-2xl sm:text-3xl font-serif font-semibold text-luxury-gold">
                            Rs {((product.price * (100 - product.discount)) / 100).toFixed(2)}
                          </span>
                          <span className="text-xs sm:text-sm text-luxury-ivory/50 line-through">
                            Rs {product.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl sm:text-3xl font-serif font-semibold text-luxury-gold">
                          Rs {product.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buttons - Sticky at bottom on mobile */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-luxury-gold/10 mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        addItem(product);
                        onClose();
                      }}
                      className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold rounded-lg hover:shadow-luxury transition-all gold-glow flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <ShoppingBag size={18} />
                      <span>Add to Cart</span>
                    </motion.button>
                    <Link href={`/product/${product.id}`} onClick={onClose} className="flex-1 sm:flex-none">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto px-4 sm:px-6 py-3 border border-luxury-gold/50 text-luxury-gold rounded-lg hover:bg-luxury-gold/10 transition-all text-sm sm:text-base"
                      >
                        View Details
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
