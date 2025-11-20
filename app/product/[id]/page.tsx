'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore, Product } from '@/lib/store';
import ReviewSection from '@/components/ReviewSection';
import PerfumeNotesSection from '@/components/PerfumeNotesSection';
import { Review } from '@/lib/data';
import { BASE_URL } from '@/lib/config';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.image || '');
        // Fetch reviews for this product
        await fetchReviews(data.id);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Product not found' }));
        console.error('Error fetching product:', errorData.error || 'Product not found');
        setProduct(null);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/reviews?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProductReviews(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setProductReviews([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-luxury-gold">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const productImages = product.images || [product.image];

  const handleAddReview = async (reviewData: Omit<Review, 'id' | 'date'>) => {
    try {
      // Save review to API
      const response = await fetch(`${BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          name: reviewData.name,
          email: reviewData.email,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });

      if (response.ok) {
        // Refresh reviews and product data to get updated rating
        await fetchReviews(id);
        await fetchProduct();
        // Show success message
        alert('Review added successfully! Product rating has been updated.');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to add review. Please try again.');
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16 relative overflow-hidden">
      {/* Smoke Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -50, -100],
              x: [0, Math.sin(i) * 30],
              opacity: [0.05, 0.1, 0.05],
              scale: [1, 1.2, 1.5],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              delay: i * 2,
              ease: 'easeInOut',
            }}
            className="absolute w-96 h-96 rounded-full bg-luxury-gold/5 blur-3xl"
            style={{
              left: `${30 + i * 25}%`,
              top: '20%',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12 md:mb-16">
          {/* Product Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-luxury-charcoal rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6 glass-reflection border border-luxury-gold/20"
            >
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
              {/* Glass Reflection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />
            </motion.div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {productImages.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(image)}
                    className={`relative h-16 sm:h-20 md:h-24 bg-luxury-charcoal rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === image
                        ? 'border-luxury-gold shadow-luxury'
                        : 'border-luxury-gold/20 hover:border-luxury-gold/50'
                    } glass-reflection`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-ivory mb-4 sm:mb-5 md:mb-6">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`${
                        i < Math.floor(product.rating || 0)
                          ? 'fill-luxury-gold text-luxury-gold'
                          : 'text-luxury-ivory/20'
                      }`}
                      size={20}
                      style={{ width: 'clamp(16px, 4vw, 28px)', height: 'clamp(16px, 4vw, 28px)' }}
                    />
                  ))}
                </div>
                <span className="text-sm sm:text-base md:text-lg text-luxury-ivory/60">
                  {product.rating || 0} ({(product.reviewsCount || 0)} reviews)
                </span>
              </div>

              <div className="mb-4 sm:mb-6 md:mb-8">
                {product.discount && product.discount > 0 ? (
                  <div className="flex flex-col">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-luxury-gold">
                      Rs {((product.price * (100 - product.discount)) / 100).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xl sm:text-2xl text-luxury-ivory/50 line-through">
                        Rs {product.price}
                      </span>
                      <span className="px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 rounded-full text-sm font-semibold">
                        {product.discount}% OFF
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-luxury-gold">
                    Rs {product.price}
                  </span>
                )}
              </div>

              <p className="text-luxury-ivory/70 mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg">
                {product.description}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 p-4 sm:p-6 glass rounded-lg sm:rounded-xl border border-luxury-gold/10">
                <div>
                  <p className="text-xs sm:text-sm text-luxury-ivory/50 mb-1">Category</p>
                  <p className="text-sm sm:text-base text-luxury-gold font-medium">{product.category}</p>
                </div>
                {product.fragranceType && (
                  <div>
                    <p className="text-xs sm:text-sm text-luxury-ivory/50 mb-1">Type</p>
                    <p className="text-sm sm:text-base text-luxury-gold font-medium">{product.fragranceType}</p>
                  </div>
                )}
                {product.size && (
                  <div>
                    <p className="text-xs sm:text-sm text-luxury-ivory/50 mb-1">Size</p>
                    <p className="text-sm sm:text-base text-luxury-gold font-medium">{product.size}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs sm:text-sm text-luxury-ivory/50 mb-1">Stock</p>
                  <p className={`text-sm sm:text-base font-medium ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center border border-luxury-gold/30 rounded-lg overflow-hidden justify-center sm:justify-start">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-luxury-gold/10 transition-colors text-luxury-ivory"
                  >
                    <Minus size={18} style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }} />
                  </button>
                  <span className="px-6 sm:px-8 py-2.5 sm:py-3 font-medium text-sm sm:text-base text-luxury-ivory border-x border-luxury-gold/30 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-luxury-gold/10 transition-colors text-luxury-ivory"
                  >
                    <Plus size={18} style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }} />
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold text-base sm:text-lg rounded-lg hover:shadow-luxury-lg transition-all gold-glow flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} style={{ width: 'clamp(18px, 4vw, 24px)', height: 'clamp(18px, 4vw, 24px)' }} />
                  <span className="whitespace-nowrap">Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Fragrance Notes Pyramid */}
        <PerfumeNotesSection notes={product.fragranceNotes || []} fragranceType={product.fragranceType || 'Oriental'} />

        {/* Reviews Section */}
        <ReviewSection
          productId={id}
          reviews={productReviews}
          onAddReview={handleAddReview}
        />
      </div>
    </div>
  );
}
