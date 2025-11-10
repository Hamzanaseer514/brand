'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  description: string;
  image: string;
  href: string;
}

export default function CategoryCard({ name, description, image, href }: CategoryCardProps) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, y: -5 }}
        className="group relative h-96 rounded-2xl overflow-hidden border border-luxury-gold/20 hover:border-luxury-gold/50 transition-all duration-500 shadow-glass hover:shadow-luxury-lg"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          {/* Fallback gradient based on category */}
          <div 
            className={`absolute inset-0 transition-transform duration-700 group-hover:scale-110 ${
              name === 'Woody' ? 'bg-gradient-to-br from-amber-900/40 via-amber-800/30 to-luxury-charcoal' :
              name === 'Floral' ? 'bg-gradient-to-br from-pink-900/40 via-rose-800/30 to-luxury-charcoal' :
              'bg-gradient-to-br from-emerald-900/40 via-teal-800/30 to-luxury-charcoal'
            }`}
            style={{ 
              backgroundImage: image ? `url(${image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/80 to-luxury-black/40" />
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 via-transparent to-luxury-gold/5 group-hover:from-luxury-gold/20 transition-all duration-500" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-serif font-bold text-luxury-ivory mb-3"
          >
            {name}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-luxury-ivory/80 mb-4 text-sm font-light"
          >
            {description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-luxury-gold group-hover:gap-4 transition-all"
          >
            <span className="text-sm font-semibold uppercase tracking-wider">Explore</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </motion.div>
        </div>

        {/* Gold Shimmer on Hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-0 shimmer bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent" />
        </motion.div>
      </motion.div>
    </Link>
  );
}
