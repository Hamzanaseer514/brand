'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Star, Search } from 'lucide-react';
import { BASE_URL } from '@/lib/config';

interface Review {
  id: string;
  productId: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  date: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [reviewsRes, productsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/reviews`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/api/products`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const reviewsData = await reviewsRes.json();
      const productsData = await productsRes.json();

      setReviews(reviewsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId || p.id?.toString() === productId);
    return product?.name || 'Unknown Product';
  };

  const getProductImage = (productId: string) => {
    const product = products.find((p) => p.id === productId || p.id?.toString() === productId);
    return product?.image || '/images/1.png';
  };

  const filteredReviews = reviews.filter(
    (review) => {
      const matchesSearch = 
        review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getProductName(review.productId).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProduct = !selectedProductId || review.productId === selectedProductId || review.productId?.toString() === selectedProductId;
      
      return matchesSearch && matchesProduct;
    }
  );

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display text-luxury-gold mb-2">Reviews</h1>
            <p className="text-luxury-ivory/60">Manage customer reviews</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-luxury-gold">{filteredReviews.length}</p>
            <p className="text-sm text-luxury-ivory/60">
              {filteredReviews.length === 1 ? 'Review' : 'Reviews'}
              {selectedProductId && ` for ${getProductName(selectedProductId)}`}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold/60" size={20} />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-luxury-charcoal border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
          />
        </div>
        <div>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-4 py-3 bg-luxury-charcoal border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
          >
            <option value="">All Products</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-luxury-charcoal border border-luxury-gold/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-luxury-gold/10 border-b border-luxury-gold/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Comment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-luxury-ivory/60">
                    Loading...
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-luxury-ivory/60">
                    No reviews found
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review, index) => (
                  <motion.tr
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-luxury-gold/10 hover:bg-luxury-gold/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-luxury-black flex-shrink-0">
                          <img
                            src={getProductImage(review.productId)}
                            alt={getProductName(review.productId)}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/1.png';
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-luxury-ivory text-sm">
                            {getProductName(review.productId)}
                          </p>
                          <p className="text-xs text-luxury-ivory/50">ID: {review.productId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-luxury-ivory">{review.name}</p>
                        <p className="text-sm text-luxury-ivory/60">{review.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? 'fill-luxury-gold text-luxury-gold'
                                : 'text-luxury-ivory/30'
                            }
                          />
                        ))}
                        <span className="ml-2 text-sm text-luxury-gold font-semibold">
                          {review.rating}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-luxury-ivory/80 text-sm max-w-md line-clamp-2">
                        {review.comment}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-luxury-ivory/60">
                      {review.date ? new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                        title="Delete Review"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

