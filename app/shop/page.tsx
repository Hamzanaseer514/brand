'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid, List, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import LuxuryProductCard from '@/components/LuxuryProductCard';
import LuxuryProductListItem from '@/components/LuxuryProductListItem';
import FilterSidebar from '@/components/FilterSidebar';
import { Product } from '@/lib/store';
import { BASE_URL } from '@/lib/config';

type SortOption = 'newest' | 'popularity' | 'price-low' | 'price-high';

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [fragranceTypes, setFragranceTypes] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: 'All',
    fragranceType: 'All',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchFragranceTypes();
  }, []);

  const fetchFragranceTypes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/fragrance-types`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const typeNames = data.map((ft: any) => (typeof ft === 'string' ? ft : ft.name));
        setFragranceTypes(['All', ...typeNames]);
      }
    } catch (error) {
      console.error('Error fetching fragrance types:', error);
      // Fallback to default types
      setFragranceTypes(['All', 'Oriental', 'Floral', 'Floral Oriental', 'Woody', 'Fresh']);
    }
  };

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/products`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
        // Update max price filter based on actual products
        if (data.length > 0) {
          const maxPrice = Math.max(...data.map((p: Product) => p.price));
          setFilters((prev) => ({ ...prev, maxPrice: Math.ceil(maxPrice) }));
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.fragranceNotes && product.fragranceNotes.some((note) =>
          note.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filters.category === 'All' || product.category === filters.category;
      const matchesFragranceType =
        filters.fragranceType === 'All' || (product.fragranceType && product.fragranceType === filters.fragranceType);
      const matchesPrice =
        product.price >= filters.minPrice && product.price <= filters.maxPrice;
      const matchesRating = (product.rating || 0) >= filters.minRating;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesFragranceType &&
        matchesPrice &&
        matchesRating
      );
    });

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        filtered.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
      case 'newest':
      default:
        // Sort by id (newest first) or by creation date if available
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return filtered;
  }, [products, searchQuery, filters, sortBy]);

  return (
    <div className="min-h-screen bg-luxury-black pt-24 md:pt-28 pb-12 md:pb-20">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-luxury-ivory">
            Our <span className="text-luxury-gold">Collection</span>
          </h1>
          <p className="text-luxury-ivory/60 text-lg">
            Discover our complete range of premium ittars
          </p>
        </motion.div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-luxury-gold/70" size={20} />
            <input
              type="text"
              placeholder="Search fragrances, notes, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory placeholder-luxury-ivory/50"
            />
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(true)}
              className="px-6 py-3 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold rounded-lg hover:bg-luxury-gold/20 hover:border-luxury-gold transition-all font-medium flex items-center gap-2"
            >
              <Filter size={20} />
              Filters
            </motion.button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold text-luxury-ivory"
            >
              <option value="newest">Newest</option>
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <div className="flex border border-luxury-gold/20 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-luxury-gold text-luxury-black'
                    : 'bg-luxury-charcoal/50 text-luxury-ivory hover:bg-luxury-charcoal'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-luxury-gold text-luxury-black'
                    : 'bg-luxury-charcoal/50 text-luxury-ivory hover:bg-luxury-charcoal'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Count */}
        {!loading && (
        <p className="text-luxury-ivory/50 mb-8 text-sm">
          Showing {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
        </p>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-luxury-ivory/60">Loading products...</p>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-luxury-ivory/60 mb-4">No products found</p>
            <p className="text-luxury-ivory/40">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-6'
            }
          >
            {filteredAndSortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {viewMode === 'grid' ? (
                  <LuxuryProductCard product={product} />
                ) : (
                  <LuxuryProductListItem product={product} />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        fragranceTypes={fragranceTypes}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-luxury-black flex items-center justify-center">
          <p className="text-luxury-gold">Loading...</p>
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}
