'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, CheckCircle, XCircle, Truck, Clock, Search } from 'lucide-react';
import Link from 'next/link';
import { BASE_URL } from '@/lib/config';

interface Order {
  id: string;
  items: Array<{ name: string; quantity: number; price: number; image?: string }>;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string | {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  total: number;
  subtotal?: number;
  tax?: number;
  status: string;
  createdAt: string;
}

function TrackOrderPageContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAutoTrack = async (id: string) => {
    if (!id.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(`${BASE_URL}/api/orders/track/${id.trim()}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill order ID from query parameter and auto-track if provided
  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
      // Auto-track the order
      handleAutoTrack(orderIdParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(`${BASE_URL}/api/orders/track/${orderId.trim()}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-orange-400" size={24} />;
      case 'processing':
        return <Package className="text-blue-400" size={24} />;
      case 'shipped':
        return <Truck className="text-purple-400" size={24} />;
      case 'delivered':
        return <CheckCircle className="text-green-400" size={24} />;
      case 'cancelled':
        return <XCircle className="text-red-400" size={24} />;
      default:
        return <Clock className="text-gray-400" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your order is pending and will be processed soon.';
      case 'processing':
        return 'Your order is being processed and prepared for shipment.';
      case 'shipped':
        return 'Your order has been shipped and is on its way to you.';
      case 'delivered':
        return 'Your order has been delivered successfully.';
      case 'cancelled':
        return 'Your order has been cancelled.';
      default:
        return 'Order status unknown.';
    }
  };

  const shippingAddress = order?.shippingAddress
    ? typeof order.shippingAddress === 'string'
      ? order.shippingAddress
      : `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`
    : '';

  return (
    <div className="min-h-screen bg-luxury-black pt-24 md:pt-28 pb-12 md:pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-luxury-ivory mb-4">
            Track Your Order
          </h1>
          <p className="text-luxury-ivory/60 text-lg">
            Enter your order ID to check the status of your order
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-2xl border border-luxury-gold/20 mb-8"
        >
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-luxury-gold/70" size={20} />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your Order ID"
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory placeholder-luxury-ivory/50"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold rounded-lg hover:shadow-luxury-lg transition-all gold-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </motion.button>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-2xl border border-luxury-gold/20 space-y-6"
          >
            {/* Order Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-luxury-gold/20">
              <div>
                <h2 className="text-2xl font-serif font-bold text-luxury-ivory mb-2">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h2>
                <p className="text-luxury-ivory/60">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className={`flex items-center gap-3 px-6 py-3 rounded-lg border ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="font-semibold uppercase">{order.status}</span>
              </div>
            </div>

            {/* Status Message */}
            <div className="p-4 bg-luxury-charcoal/30 rounded-lg border border-luxury-gold/10">
              <p className="text-luxury-ivory/80">{getStatusText(order.status)}</p>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-xl font-serif font-bold text-luxury-ivory mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-luxury-charcoal/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-luxury-gold/20 to-luxury-gold-dark/20 flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-luxury-ivory font-semibold">{item.name}</p>
                        <p className="text-luxury-ivory/60 text-sm">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-luxury-gold font-semibold">
                      Rs {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-luxury-gold/20 pt-6">
              <h3 className="text-xl font-serif font-bold text-luxury-ivory mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-luxury-ivory/80">
                  <span>Subtotal</span>
                  <span>Rs {order.subtotal ? order.subtotal.toFixed(2) : order.total.toFixed(2)}</span>
                </div>
                {order.tax && order.tax > 0 && (
                  <div className="flex justify-between text-luxury-ivory/80">
                    <span>Tax</span>
                    <span>Rs {order.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-serif font-semibold text-luxury-gold pt-4 border-t border-luxury-gold/20">
                  <span>Total</span>
                  <span>Rs {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="border-t border-luxury-gold/20 pt-6">
              <h3 className="text-xl font-serif font-bold text-luxury-ivory mb-4">Shipping Information</h3>
              <div className="p-4 bg-luxury-charcoal/30 rounded-lg space-y-2">
                <p className="text-luxury-ivory"><strong>Name:</strong> {order.customerName}</p>
                <p className="text-luxury-ivory"><strong>Email:</strong> {order.customerEmail}</p>
                <p className="text-luxury-ivory"><strong>Phone:</strong> {order.customerPhone}</p>
                <p className="text-luxury-ivory"><strong>Address:</strong> {shippingAddress}</p>
                <p className="text-luxury-ivory"><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
              </div>
            </div>

            {/* Back to Shop */}
            <div className="pt-6 border-t border-luxury-gold/20">
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold rounded-lg hover:shadow-luxury-lg transition-all gold-glow"
                >
                  Continue Shopping
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-luxury-black flex items-center justify-center">
          <p className="text-luxury-gold">Loading...</p>
        </div>
      }
    >
      <TrackOrderPageContent />
    </Suspense>
  );
}
