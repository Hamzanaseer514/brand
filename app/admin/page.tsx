'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Star, MessageSquare, TrendingUp, DollarSign } from 'lucide-react';
import { BASE_URL } from '@/lib/config';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalReviews: number;
  totalTestimonials: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalReviews: 0,
    totalTestimonials: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const [productsRes, ordersRes, reviewsRes, testimonialsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/products`, { headers }),
        fetch(`${BASE_URL}/api/orders`, { headers }),
        fetch(`${BASE_URL}/api/reviews`, { headers }),
        fetch(`${BASE_URL}/api/testimonials`, { headers }),
      ]);

      const products = await productsRes.json();
      const orders = await ordersRes.json();
      const reviews = await reviewsRes.json();
      const testimonials = await testimonialsRes.json();

      const totalRevenue = orders.reduce((sum: number, order: any) => {
        return sum + (order.status === 'delivered' ? order.total : 0);
      }, 0);

      const pendingOrders = orders.filter((order: any) => order.status === 'pending').length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalReviews: reviews.length,
        totalTestimonials: testimonials.length,
        totalRevenue,
        pendingOrders,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: Package,
      label: 'Total Products',
      value: stats.totalProducts,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      icon: ShoppingBag,
      label: 'Total Orders',
      value: stats.totalOrders,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `Rs ${stats.totalRevenue.toFixed(2)}`,
      color: 'text-luxury-gold',
      bgColor: 'bg-luxury-gold/20',
    },
    {
      icon: MessageSquare,
      label: 'Reviews',
      value: stats.totalReviews,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      icon: Star,
      label: 'Testimonials',
      value: stats.totalTestimonials,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
    },
    {
      icon: TrendingUp,
      label: 'Pending Orders',
      value: stats.pendingOrders,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-luxury-gold">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display text-luxury-gold mb-2">Dashboard</h1>
        <p className="text-luxury-ivory/60">Overview of your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} border border-luxury-gold/20 rounded-xl p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={stat.color} size={32} />
              </div>
              <h3 className="text-2xl font-bold text-luxury-ivory mb-1">{stat.value}</h3>
              <p className="text-sm text-luxury-ivory/60">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

