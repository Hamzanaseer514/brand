'use client';

import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { CartItem as CartItemType } from '@/lib/store';
import { useCartStore } from '@/lib/store';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 glass p-4 sm:p-6 rounded-lg sm:rounded-xl border border-luxury-gold/20"
    >
      <div className="relative w-full sm:w-24 md:w-32 h-48 sm:h-24 md:h-32 bg-luxury-charcoal rounded-lg overflow-hidden flex-shrink-0 glass-reflection">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="128px"
          unoptimized
        />
      </div>

      <div className="flex-1 w-full">
        <h3 className="font-serif text-lg sm:text-xl text-luxury-ivory mb-1 sm:mb-2">{item.name}</h3>
        <p className="text-xs sm:text-sm text-luxury-ivory/50 mb-3 sm:mb-4">{item.size}</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-6">
          <div className="flex items-center border border-luxury-gold/30 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-2 hover:bg-luxury-gold/10 transition-colors text-luxury-ivory"
            >
              <Minus size={16} style={{ width: 'clamp(14px, 4vw, 18px)', height: 'clamp(14px, 4vw, 18px)' }} />
            </button>
            <span className="px-3 sm:px-4 py-2 font-medium text-sm sm:text-base text-luxury-ivory border-x border-luxury-gold/30 min-w-[40px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-2 hover:bg-luxury-gold/10 transition-colors text-luxury-ivory"
            >
              <Plus size={16} style={{ width: 'clamp(14px, 4vw, 18px)', height: 'clamp(14px, 4vw, 18px)' }} />
            </button>
          </div>
          <div className="flex flex-col">
            {item.discount && item.discount > 0 ? (
              <>
                <span className="text-xl sm:text-2xl font-serif font-semibold text-luxury-gold">
                  Rs {(((item.price * (100 - item.discount)) / 100) * item.quantity).toFixed(2)}
                </span>
                <span className="text-sm text-luxury-ivory/50 line-through">
                  Rs {(item.price * item.quantity).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl sm:text-2xl font-serif font-semibold text-luxury-gold">
                Rs {(item.price * item.quantity).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => removeItem(item.id)}
        className="p-2.5 sm:p-3 rounded-lg glass hover:bg-red-500/10 border border-red-500/30 hover:border-red-500 transition-all self-end sm:self-auto"
      >
        <Trash2 className="text-red-400" size={18} style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }} />
      </button>
    </motion.div>
  );
}
