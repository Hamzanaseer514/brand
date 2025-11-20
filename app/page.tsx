'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import LuxuryProductCard from '@/components/LuxuryProductCard';
import ReviewCarousel from '@/components/ReviewCarousel';
import { motion } from 'framer-motion';
import { Product } from '@/lib/store';
import { BASE_URL } from '@/lib/config';
import { generateStructuredData } from './metadata';

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    
    // Add structured data for SEO
    const organizationData = generateStructuredData('Organization');
    const websiteData = generateStructuredData('WebSite');
    
    const script1 = document.createElement('script');
    script1.type = 'application/ld+json';
    script1.text = JSON.stringify(organizationData);
    script1.id = 'organization-structured-data';
    
    const script2 = document.createElement('script');
    script2.type = 'application/ld+json';
    script2.text = JSON.stringify(websiteData);
    script2.id = 'website-structured-data';
    
    // Remove existing if any
    const existing1 = document.getElementById('organization-structured-data');
    const existing2 = document.getElementById('website-structured-data');
    if (existing1) existing1.remove();
    if (existing2) existing2.remove();
    
    document.head.appendChild(script1);
    document.head.appendChild(script2);
    
    return () => {
      const s1 = document.getElementById('organization-structured-data');
      const s2 = document.getElementById('website-structured-data');
      if (s1) s1.remove();
      if (s2) s2.remove();
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/products`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // Take first 6 products as featured
        setFeaturedProducts(data.slice(0, 6));
      } else {
        setFeaturedProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setFeaturedProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories`);
      const data = await response.json();
      // Filter out 'All' and take first 3 categories
      const filteredCategories = Array.isArray(data)
        ? data.filter((c: any) => c.name !== 'All' && typeof c === 'object').slice(0, 3)
        : [];
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        {
          id: '1',
          name: 'Woody',
          description: 'Rich oud, sandalwood, and amber scents',
          image: '/images/1.png',
        },
        {
          id: '2',
          name: 'Floral',
          description: 'Delicate roses, jasmine, and gardenia',
          image: '/images/2.png',
        },
        {
          id: '3',
          name: 'Fresh',
          description: 'Crisp citrus and aquatic notes',
          image: '/images/3.png',
        },
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

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
            {loadingCategories ? (
              <div className="col-span-full text-center text-luxury-ivory/60 py-12">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="col-span-full text-center text-luxury-ivory/60 py-12">No categories available</div>
            ) : (
              categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <CategoryCard
                    name={category.name}
                    description={category.description || ''}
                    image={category.image || '/images/1.png'}
                    href={`/shop?category=${category.name}`}
                  />
                </motion.div>
              ))
            )}
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
          {loadingProducts ? (
            <div className="text-center text-luxury-ivory/60 py-12">Loading products...</div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center text-luxury-ivory/60 py-12">No products available</div>
          ) : (
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
          )}
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
