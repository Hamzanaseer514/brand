'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import CartItem from '@/components/CartItem';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-black pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <ShoppingBag size={80} style={{ width: 'clamp(60px, 20vw, 100px)', height: 'clamp(60px, 20vw, 100px)' }} className="mx-auto text-luxury-gold/30 mb-6 sm:mb-8" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-luxury-ivory mb-3 sm:mb-4">Your Cart is Empty</h2>
            <p className="text-luxury-ivory/60 mb-6 sm:mb-8 text-base sm:text-lg px-4">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold rounded-lg hover:shadow-luxury-lg transition-all inline-flex items-center gap-2 sm:gap-3 gold-glow text-sm sm:text-base"
              >
                Continue Shopping
                <ArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-ivory mb-6 sm:mb-8 md:mb-12">
          Shopping <span className="text-luxury-gold">Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCart}
              className="text-sm sm:text-base text-luxury-ivory/60 hover:text-red-400 transition-colors font-medium"
            >
              Clear Cart
            </motion.button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-luxury-gold/20 sticky top-24 sm:top-32"
            >
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-luxury-ivory mb-4 sm:mb-6 md:mb-8">Order Summary</h2>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex justify-between text-sm sm:text-base text-luxury-ivory/80">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-luxury-ivory/80">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-luxury-gold/20 pt-3 sm:pt-4 flex justify-between text-lg sm:text-xl md:text-2xl font-serif font-semibold text-luxury-gold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold rounded-lg hover:shadow-luxury-lg transition-all gold-glow flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-sm sm:text-base"
                >
                  Proceed to Checkout
                  <ArrowRight />
                </motion.button>
              </Link>

              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-luxury-gold/30 text-luxury-gold rounded-lg hover:bg-luxury-gold/10 hover:border-luxury-gold transition-all font-medium text-sm sm:text-base"
                >
                  Continue Shopping
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
