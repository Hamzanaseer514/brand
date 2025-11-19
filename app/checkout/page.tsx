'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import { BASE_URL } from '@/lib/config';

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.discount && item.discount > 0 
            ? (item.price * (100 - item.discount)) / 100 
            : item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        subtotal: subtotal,
        tax: tax,
        total: total,
      };

      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Order placed successfully! Invoice has been sent to ${formData.email}`);
        clearCart();
        // Redirect to home or order confirmation page
        window.location.href = '/';
      } else {
        alert(`Error: ${data.error || 'Failed to place order'}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-black py-12 md:py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-luxury-ivory mb-4">Your Cart is Empty</h2>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold rounded-lg hover:shadow-luxury-lg transition-all"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black pt-24 md:pt-28 pb-12 md:pb-20">
      <div className="container mx-auto px-6">
        <Link href="/cart" className="inline-flex items-center gap-2 text-luxury-gold hover:text-luxury-gold-light mb-8 transition-colors">
          <ArrowLeft size={20} />
          Back to Cart
        </Link>

        <h1 className="text-5xl md:text-6xl font-serif font-bold text-luxury-ivory mb-12">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-2xl border border-luxury-gold/20"
            >
              <h2 className="text-3xl font-serif font-bold text-luxury-ivory mb-8">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">Zip Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">Country *</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory"
                  />
                </div>
              </div>
            </motion.div>

          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-2xl border border-luxury-gold/20 sticky top-32"
            >
              <h2 className="text-3xl font-serif font-bold text-luxury-ivory mb-8">Order Summary</h2>

              <div className="space-y-4 mb-8">
                {items.map((item) => {
                  const discountedPrice = item.discount && item.discount > 0
                    ? (item.price * (100 - item.discount)) / 100
                    : item.price;
                  return (
                    <div key={item.id} className="flex flex-col gap-1">
                      <div className="flex justify-between text-sm text-luxury-ivory/80">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        {item.discount && item.discount > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="text-luxury-gold font-semibold">
                              Rs {(discountedPrice * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-xs text-luxury-ivory/50 line-through">
                              Rs {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-luxury-gold/20 pt-4 space-y-4 mb-8">
                <div className="flex justify-between text-luxury-ivory/80">
                  <span>Subtotal</span>
                  <span>Rs {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-luxury-ivory/80">
                  <span>Tax</span>
                  <span>Rs {tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-luxury-gold/20 pt-4 flex justify-between text-2xl font-serif font-semibold text-luxury-gold">
                  <span>Total</span>
                  <span>Rs {total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                className="w-full px-6 py-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold rounded-lg hover:shadow-luxury-lg transition-all gold-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </motion.button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
