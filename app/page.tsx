'use client';

import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import LuxuryProductCard from '@/components/LuxuryProductCard';
import ReviewCarousel from '@/components/ReviewCarousel';
import { products, testimonials } from '@/lib/data';
import { motion } from 'framer-motion';

export default function Home() {
  const featuredProducts = products.slice(0, 6);
  const categories = [
    {
      name: 'Woody',
      description: 'Rich oud, sandalwood, and amber scents',
      image: '/images/1.png',
      href: '/shop?category=Woody',
    },
    {
      name: 'Floral',
      description: 'Delicate roses, jasmine, and gardenia',
      image: '/images/2.png',
      href: '/shop?category=Floral',
    },
    {
      name: 'Fresh',
      description: 'Crisp citrus and aquatic notes',
      image: '/images/3.png',
      href: '/shop?category=Fresh',
    },
  ];

  return (
    <main className="min-h-screen bg-luxury-black">
      <HeroSection />

      {/* Featured Categories */}
      <section className="py-20 bg-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxury-gold/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-luxury-ivory">
              Explore Our
              <span className="block text-luxury-gold">Collections</span>
            </h2>
            <p className="text-luxury-ivory/60 max-w-2xl mx-auto text-lg">
              Discover the finest fragrances from around the world, each crafted with passion and precision
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <CategoryCard {...category} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="py-20 bg-luxury-charcoal relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4">
              <span className="text-luxury-gold">Best</span>{' '}
              <span className="text-luxury-ivory">Sellers</span>
            </h2>
            <p className="text-luxury-ivory/60 max-w-2xl mx-auto text-lg">
              Our most beloved fragrances, handpicked for their exceptional quality and timeless appeal
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <LuxuryProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/5 via-transparent to-luxury-gold/5" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-luxury-ivory">
              What Our
              <span className="block text-luxury-gold">Customers Say</span>
            </h2>
            <p className="text-luxury-ivory/60 max-w-2xl mx-auto text-lg">
              Experience the luxury through the words of our satisfied customers
            </p>
          </motion.div>
          <ReviewCarousel />
        </div>
      </section>
    </main>
  );
}
