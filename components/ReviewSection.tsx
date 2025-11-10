'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Review } from '@/lib/data';

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

export default function ReviewSection({ productId, reviews, onAddReview }: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview({
      productId,
      ...formData,
    });
    setFormData({ name: '', email: '', rating: 5, comment: '' });
    setShowForm(false);
  };

  const filteredReviews = reviews.filter((r) => r.productId === productId);

  return (
    <div className="mt-16 pt-16 border-t border-luxury-gold/10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-serif text-luxury-ivory">
          Customer Reviews ({filteredReviews.length})
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold rounded-lg hover:bg-luxury-gold/20 hover:border-luxury-gold transition-all font-medium"
        >
          {showForm ? 'Cancel' : 'Add Review'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="glass p-8 rounded-2xl mb-8 border border-luxury-gold/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-luxury-ivory/70 mb-3">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`${
                        rating <= formData.rating
                          ? 'fill-luxury-gold text-luxury-gold'
                          : 'text-luxury-ivory/20'
                      } transition-colors`}
                      size={32}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">Comment</label>
              <textarea
                required
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold text-luxury-ivory resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold rounded-lg hover:shadow-luxury transition-all"
            >
              Submit Review
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <p className="text-center py-12 text-luxury-ivory/50">No reviews yet. Be the first to review!</p>
        ) : (
          filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-xl border border-luxury-gold/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-luxury-ivory mb-1">{review.name}</h4>
                  <p className="text-sm text-luxury-ivory/50">{review.date}</p>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`${
                        i < review.rating ? 'fill-luxury-gold text-luxury-gold' : 'text-luxury-ivory/20'
                      }`}
                      size={18}
                    />
                  ))}
                </div>
              </div>
              <p className="text-luxury-ivory/80 leading-relaxed">{review.comment}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
