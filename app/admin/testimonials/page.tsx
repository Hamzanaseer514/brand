'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { BASE_URL } from '@/lib/config';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  location: string;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    rating: '5',
    comment: '',
    location: '',
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/testimonials`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      rating: testimonial.rating.toString(),
      comment: testimonial.comment,
      location: testimonial.location || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const testimonialData = {
        ...formData,
        rating: parseInt(formData.rating),
      };

      const url = editingTestimonial
        ? `${BASE_URL}/api/testimonials/${editingTestimonial.id}`
        : `${BASE_URL}/api/testimonials`;
      const method = editingTestimonial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testimonialData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingTestimonial(null);
        setFormData({
          name: '',
          rating: '5',
          comment: '',
          location: '',
        });
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display text-luxury-gold mb-2">Testimonials</h1>
          <p className="text-luxury-ivory/60">Manage customer testimonials</p>
        </div>
        <button
          onClick={() => {
            setEditingTestimonial(null);
            setFormData({
              name: '',
              rating: '5',
              comment: '',
              location: '',
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-luxury-gold text-luxury-black font-semibold rounded-lg hover:bg-luxury-gold-light transition-all"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-luxury-ivory/60 py-12">Loading...</div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-full text-center text-luxury-ivory/60 py-12">
            No testimonials found
          </div>
        ) : (
          testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-luxury-charcoal border border-luxury-gold/20 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-luxury-ivory mb-1">{testimonial.name}</h3>
                  {testimonial.location && (
                    <p className="text-sm text-luxury-ivory/60">{testimonial.location}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < testimonial.rating
                        ? 'fill-luxury-gold text-luxury-gold'
                        : 'text-luxury-ivory/30'
                    }
                  />
                ))}
              </div>
              <p className="text-luxury-ivory/80">{testimonial.comment}</p>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-charcoal border border-luxury-gold/20 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-display text-luxury-gold mb-6">
              {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory mb-2">Rating *</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-ivory mb-2">Comment *</label>
                <textarea
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-luxury-gold text-luxury-black font-semibold rounded-lg hover:bg-luxury-gold-light transition-all"
                >
                  {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTestimonial(null);
                  }}
                  className="px-6 py-3 bg-luxury-charcoal border border-luxury-gold/20 text-luxury-ivory rounded-lg hover:bg-luxury-gold/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

