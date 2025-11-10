'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Product } from '@/lib/store';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-cream-light rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gold-light"
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64 bg-cream overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-deepGreen mb-2 hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`${
                  i < Math.floor(product.rating)
                    ? 'fill-gold text-gold'
                    : 'text-gray-300'
                }`}
                size={16}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            ({product.reviewsCount})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gold">${product.price}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addItem(product)}
            className="bg-deepGreen text-cream-light px-4 py-2 rounded-lg hover:bg-deepGreen-light transition-colors font-medium"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

