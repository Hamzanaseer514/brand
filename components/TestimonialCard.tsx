'use client';

import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  comment: string;
}

export default function TestimonialCard({ name, location, rating, comment }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-cream-light p-6 rounded-lg shadow-md border border-gold-light"
    >
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`${
              i < rating ? 'fill-gold text-gold' : 'text-gray-300'
            }`}
            size={20}
          />
        ))}
      </div>
      <p className="text-gray-700 mb-4 italic">&quot;{comment}&quot;</p>
      <div>
        <p className="font-semibold text-deepGreen">{name}</p>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
    </motion.div>
  );
}

