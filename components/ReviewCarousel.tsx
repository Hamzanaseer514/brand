'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BASE_URL } from '@/lib/config';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  location: string;
}

export default function ReviewCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/testimonials`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setTestimonials(data);
      } else {
        // Fallback to empty array if no testimonials
        setTestimonials([]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }
  };

  const prev = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  if (loading) {
    return (
      <div className="relative h-80 flex items-center justify-center">
        <div className="text-luxury-gold/60">Loading testimonials...</div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="relative h-80 flex items-center justify-center">
        <div className="text-luxury-ivory/60 text-center">
          <p className="text-lg mb-2">No testimonials yet</p>
          <p className="text-sm">Check back soon for customer reviews!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative h-80 overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 glass backdrop-blur-md p-8 rounded-2xl border border-luxury-gold/20"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonials[currentIndex]?.rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="fill-luxury-gold text-luxury-gold"
                    size={24}
                  />
                ))}
              </div>

              {/* Comment */}
              <blockquote className="text-xl md:text-2xl font-serif text-luxury-ivory/90 mb-8 max-w-3xl leading-relaxed italic">
                &quot;{testimonials[currentIndex]?.comment || ''}&quot;
              </blockquote>

              {/* Author */}
              <div>
                <p className="font-semibold text-luxury-gold text-lg mb-1">
                  {testimonials[currentIndex]?.name || ''}
                </p>
                <p className="text-luxury-ivory/60 text-sm">
                  {testimonials[currentIndex]?.location || ''}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 glass backdrop-blur-md p-3 rounded-full border border-luxury-gold/30 hover:border-luxury-gold transition-all hover:scale-110"
          >
            <ChevronLeft className="text-luxury-gold" size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 glass backdrop-blur-md p-3 rounded-full border border-luxury-gold/30 hover:border-luxury-gold transition-all hover:scale-110"
          >
            <ChevronRight className="text-luxury-gold" size={24} />
          </button>
        </>
      )}

      {/* Indicators */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-luxury-gold'
                  : 'w-2 bg-luxury-gold/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
