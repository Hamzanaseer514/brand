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
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          >
            <div className="relative bg-gradient-to-b from-luxury-charcoal to-luxury-black rounded-2xl border border-luxury-gold/30 shadow-luxury-lg overflow-hidden w-full max-w-[95vw] sm:max-w-3xl lg:max-w-5xl max-h-[90vh]">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 glass backdrop-blur-md p-2 rounded-full border border-luxury-gold/30 hover:border-luxury-gold transition-colors"
              >
                <X className="text-luxury-gold" size={20} />
              </button>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 overflow-y-auto">
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
                <div className="flex flex-col justify-center">
                  <h2 className="font-serif text-3xl text-luxury-ivory mb-4">
                    {product.name}
                  </h2>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`${
                            i < Math.floor(product.rating)
                              ? 'fill-luxury-gold text-luxury-gold'
                              : 'text-luxury-ivory/20'
                          }`}
                          size={18}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-luxury-ivory/50">
                      {product.rating} ({product.reviewsCount} reviews)
                    </span>
                  </div>

                  <p className="text-luxury-ivory/70 mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mb-6">
                    <p className="text-sm text-luxury-ivory/60 mb-2">Fragrance Notes:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.fragranceNotes.slice(0, 4).map((note) => (
                        <span
                          key={note}
                          className="px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-xs text-luxury-gold"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6 pt-6 border-t border-luxury-gold/10">
                    <span className="text-3xl font-serif font-semibold text-luxury-gold">
                      ${product.price}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        addItem(product);
                        onClose();
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold rounded-lg hover:shadow-luxury transition-all gold-glow"
                    >
                      <ShoppingBag className="inline mr-2" size={20} />
                      Add to Cart
                    </motion.button>
                    <Link href={`/product/${product.id}`} onClick={onClose}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 border border-luxury-gold/50 text-luxury-gold rounded-lg hover:bg-luxury-gold/10 transition-all"
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
