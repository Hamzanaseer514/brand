'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, XCircle, Truck, Clock } from 'lucide-react';
import { BASE_URL } from '@/lib/config';

interface Order {
  id: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
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
  status: string;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-orange-400" size={20} />;
      case 'processing':
        return <Package className="text-blue-400" size={20} />;
      case 'shipped':
        return <Truck className="text-purple-400" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-400" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-500/20 text-orange-400';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400';
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-luxury-gold mb-2">Orders</h1>
        <p className="text-luxury-ivory/60">Manage customer orders</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-luxury-ivory/60 py-12">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-luxury-ivory/60 py-12">No orders found</div>
        ) : (
          orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-luxury-charcoal border border-luxury-gold/20 rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-luxury-ivory">Order #{order.id.slice(0, 8)}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-luxury-ivory/60 mb-1">
                    <strong>Customer:</strong> {order.customerName} ({order.customerEmail})
                  </p>
                  <p className="text-sm text-luxury-ivory/60 mb-1">
                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-luxury-ivory/60">
                    <strong>Payment:</strong> {order.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-luxury-gold mb-2">Rs {order.total.toFixed(2)}</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-luxury-gold/20 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-luxury-gold mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm text-luxury-ivory/80">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-luxury-gold">Rs {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {order.shippingAddress && (
                <div className="border-t border-luxury-gold/20 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-luxury-gold mb-1">Shipping Address:</h4>
                  <p className="text-sm text-luxury-ivory/60">
                    {typeof order.shippingAddress === 'string' 
                      ? order.shippingAddress 
                      : `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`
                    }
                  </p>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

