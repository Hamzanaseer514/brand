'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { categories, fragranceTypes } from '@/lib/data';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    category: string;
    fragranceType: string;
    minPrice: number;
    maxPrice: number;
    minRating: number;
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'price']);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleFilterChange = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-luxury-black/80 backdrop-blur-sm z-40 md:hidden"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-luxury-charcoal shadow-2xl z-50 overflow-y-auto border-r border-luxury-gold/20"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif text-luxury-ivory">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg glass hover:bg-luxury-gold/10 transition-colors"
                >
                  <X className="text-luxury-gold" size={24} />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('category')}
                  className="flex items-center justify-between w-full mb-4 text-luxury-ivory font-semibold"
                >
                  <span>Category</span>
                  <ChevronDown
                    className={`text-luxury-gold transition-transform ${
                      expandedSections.includes('category') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSections.includes('category') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3"
                    >
                      {categories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center space-x-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={filters.category === category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-4 h-4 text-luxury-gold focus:ring-luxury-gold bg-luxury-charcoal border-luxury-gold/30"
                          />
                          <span className="text-luxury-ivory/80 group-hover:text-luxury-gold transition-colors">
                            {category}
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fragrance Type Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('fragranceType')}
                  className="flex items-center justify-between w-full mb-4 text-luxury-ivory font-semibold"
                >
                  <span>Fragrance Type</span>
                  <ChevronDown
                    className={`text-luxury-gold transition-transform ${
                      expandedSections.includes('fragranceType') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSections.includes('fragranceType') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 max-h-48 overflow-y-auto"
                    >
                      {fragranceTypes.map((type) => (
                        <label
                          key={type}
                          className="flex items-center space-x-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="fragranceType"
                            value={type}
                            checked={filters.fragranceType === type}
                            onChange={(e) => handleFilterChange('fragranceType', e.target.value)}
                            className="w-4 h-4 text-luxury-gold focus:ring-luxury-gold bg-luxury-charcoal border-luxury-gold/30"
                          />
                          <span className="text-luxury-ivory/80 group-hover:text-luxury-gold transition-colors">
                            {type}
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full mb-4 text-luxury-ivory font-semibold"
                >
                  <span>Price Range</span>
                  <ChevronDown
                    className={`text-luxury-gold transition-transform ${
                      expandedSections.includes('price') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSections.includes('price') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm text-luxury-ivory/70 mb-2">Min Price</label>
                        <input
                          type="number"
                          min="0"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                          className="w-full px-4 py-2 rounded-lg bg-luxury-black/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-luxury-ivory/70 mb-2">Max Price</label>
                        <input
                          type="number"
                          min="0"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                          className="w-full px-4 py-2 rounded-lg bg-luxury-black/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold text-luxury-ivory"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('rating')}
                  className="flex items-center justify-between w-full mb-4 text-luxury-ivory font-semibold"
                >
                  <span>Min Rating</span>
                  <ChevronDown
                    className={`text-luxury-gold transition-transform ${
                      expandedSections.includes('rating') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSections.includes('rating') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3"
                    >
                      {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center space-x-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="rating"
                            value={rating}
                            checked={filters.minRating === rating}
                            onChange={(e) =>
                              handleFilterChange('minRating', Number(e.target.value))
                            }
                            className="w-4 h-4 text-luxury-gold focus:ring-luxury-gold bg-luxury-charcoal border-luxury-gold/30"
                          />
                          <span className="text-luxury-ivory/80 group-hover:text-luxury-gold transition-colors">
                            {rating}+ Stars
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Clear Filters */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  onFilterChange({
                    category: 'All',
                    fragranceType: 'All',
                    minPrice: 0,
                    maxPrice: 1000,
                    minRating: 0,
                  })
                }
                className="w-full bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold py-3 rounded-lg hover:bg-luxury-gold/20 hover:border-luxury-gold transition-all font-medium"
              >
                Clear Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
