'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BASE_URL } from '@/lib/config';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  discount?: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [fragranceTypes, setFragranceTypes] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    images: '',
    category: '',
    fragranceType: 'Oriental',
    fragranceNotes: '',
    inStock: true,
    size: '50ml',
    discount: '0',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchFragranceTypes();
  }, []);

  // Fetch products when page, search, category, or itemsPerPage changes
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, selectedCategory, itemsPerPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Build query params for pagination
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      const response = await fetch(`${BASE_URL}/api/products?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      // Handle paginated response
      if (data.products && data.pagination) {
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalItems(data.pagination.totalItems || 0);
        setItemsPerPage(data.pagination.itemsPerPage || 10);
        setHasNextPage(data.pagination.hasNextPage || false);
        setHasPrevPage(data.pagination.hasPrevPage || false);
      } else if (Array.isArray(data)) {
        // Fallback for non-paginated response
        setProducts(data);
        setTotalItems(data.length);
        setTotalPages(1);
        setHasNextPage(false);
        setHasPrevPage(false);
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

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // Handle both old format (array of strings) and new format (array of objects)
      const categoryNames = Array.isArray(data)
        ? data
            .filter((c: any) => {
              if (typeof c === 'string') return c !== 'All';
              if (typeof c === 'object' && c.name) return c.name !== 'All';
              return false;
            })
            .map((c: any) => (typeof c === 'string' ? c : c.name))
        : [];
      setCategories(categoryNames);
      
      // Set default category if formData.category is empty
      if (!formData.category && categoryNames.length > 0) {
        setFormData(prev => ({ ...prev, category: categoryNames[0] }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFragranceTypes = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/fragrance-types`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setFragranceTypes(data);
        // Set default fragrance type if formData.fragranceType is empty
        if (!formData.fragranceType && data.length > 0) {
          setFormData(prev => ({ ...prev, fragranceType: data[0].name }));
        }
      }
    } catch (error) {
      console.error('Error fetching fragrance types:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh products after delete
        if (currentPage > 1 && products.length === 1) {
          // If we're on last page and delete last item, go to previous page
          setCurrentPage(currentPage - 1);
        } else {
          fetchProducts();
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleImageUpload = async (file: File, isMainImage: boolean = true) => {
    try {
      setUploading(true);
      const token = localStorage.getItem('adminToken');
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await fetch(`${BASE_URL}/api/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        if (isMainImage) {
          setFormData(prev => ({ ...prev, image: data.url }));
          setImagePreview(data.url);
        } else {
          setFormData(prev => {
            const currentImages = prev.images ? prev.images.split(',').filter(Boolean) : [];
            const newImages = [...currentImages, data.url];
            return { ...prev, images: newImages.join(',') };
          });
          setAdditionalImagesPreview(prev => [...prev, data.url]);
        }
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleImageUpload = async (files: FileList) => {
    try {
      setUploading(true);
      const token = localStorage.getItem('adminToken');
      const uploadFormData = new FormData();
      
      Array.from(files).forEach((file) => {
        uploadFormData.append('images', file);
      });

      const response = await fetch(`${BASE_URL}/api/upload/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        const imageUrls = data.images.map((img: any) => img.url);
        // Get existing images from state, not from FormData
        setFormData(prev => {
          const existingImages = prev.images ? prev.images.split(',').filter(Boolean) : [];
          const allImages = [...existingImages, ...imageUrls];
          return { ...prev, images: allImages.join(',') };
        });
        setAdditionalImagesPreview(prev => [...prev, ...imageUrls]);
      } else {
        alert('Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const productImages = (product as any).images || [];
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image: product.image || '',
      images: productImages.join(',') || '',
      category: product.category || 'Woody',
      fragranceType: (product as any).fragranceType || 'Oriental',
      fragranceNotes: (product as any).fragranceNotes?.join(',') || '',
      inStock: product.inStock !== undefined ? product.inStock : true,
      size: (product as any).size || '50ml',
      discount: ((product as any).discount || 0).toString(),
    });
    setImagePreview(product.image || '');
    setAdditionalImagesPreview(productImages);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      
      // Process images array - ensure it's properly formatted
      const imagesArray = formData.images 
        ? formData.images.split(',').map((img) => img.trim()).filter(Boolean)
        : [];
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount) || 0,
        images: imagesArray,
        fragranceNotes: formData.fragranceNotes.split(',').map((note) => note.trim()).filter(Boolean),
      };
      
      console.log('Saving product with images:', imagesArray); // Debug log

      const url = editingProduct
        ? `${BASE_URL}/api/products/${editingProduct.id}`
        : `${BASE_URL}/api/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingProduct(null);
        const defaultCategory = categories.length > 0 ? categories[0] : '';
        setFormData({
          name: '',
          description: '',
          price: '',
          image: '',
          images: '',
          category: defaultCategory,
          fragranceType: 'Oriental',
          fragranceNotes: '',
          inStock: true,
          size: '50ml',
          discount: '0',
        });
        setImagePreview('');
        setAdditionalImagesPreview([]);
        fetchProducts();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error saving product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Reset to page 1 when search or category changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, selectedCategory]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display text-luxury-gold mb-2">Products</h1>
          <p className="text-luxury-ivory/60">Manage your product catalog</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            const defaultCategory = categories.length > 0 ? categories[0] : '';
            setFormData({
              name: '',
              description: '',
              price: '',
              image: '',
              images: '',
              category: defaultCategory,
              fragranceType: 'Oriental',
              fragranceNotes: '',
              inStock: true,
              size: '50ml',
              discount: '0',
            });
            setImagePreview('');
            setAdditionalImagesPreview([]);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-luxury-gold text-luxury-black font-semibold rounded-lg hover:bg-luxury-gold-light transition-all"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search and Category Filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold/60" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-luxury-charcoal border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-luxury-charcoal border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Per Page Selector - Above Table */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-luxury-ivory/60">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 bg-luxury-charcoal border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        {/* Results Summary */}
        {!loading && (
          <div className="text-sm text-luxury-ivory/60">
            Showing {products.length > 0 ? ((currentPage - 1) * itemsPerPage + 1) : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-luxury-charcoal border border-luxury-gold/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-luxury-gold/10 border-b border-luxury-gold/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Discount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-gold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-luxury-ivory/60">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-luxury-ivory/60">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-luxury-gold/10 hover:bg-luxury-gold/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-luxury-black">
                        {(() => {
                          const imageUrl = product.image?.trim();
                          // Only render Image if we have a valid URL (starts with / or http)
                          if (imageUrl && (imageUrl.startsWith('/') || imageUrl.startsWith('http'))) {
                            return (
                              <Image
                                src={imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            );
                          }
                          // Show placeholder for missing/invalid images
                          return (
                            <div className="w-full h-full flex items-center justify-center text-luxury-ivory/30 text-xs">
                              No Image
                            </div>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-luxury-ivory">{product.name}</div>
                      <div className="text-sm text-luxury-ivory/60 line-clamp-1">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-luxury-ivory/80">{product.category}</td>
                    <td className="px-6 py-4">
                      {product.discount && product.discount > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-luxury-gold font-semibold">
                            Rs {((product.price * (100 - product.discount)) / 100).toFixed(2)}
                          </span>
                          <span className="text-xs text-luxury-ivory/50 line-through">
                            Rs {product.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-luxury-gold font-semibold">Rs {product.price}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.discount && product.discount > 0 ? (
                        <span className="px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 rounded-full text-xs font-semibold">
                          {product.discount}%
                        </span>
                      ) : (
                        <span className="text-luxury-ivory/50 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.inStock
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-luxury-gold">{product.rating}</span>
                        <span className="text-luxury-ivory/60">({product.reviewsCount})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="p-2 text-luxury-gold hover:bg-luxury-gold/20 rounded-lg transition-all"
                          target="_blank"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Page Info */}
        {totalPages > 1 && (
          <div className="text-sm text-luxury-ivory/60">
            Page {currentPage} of {totalPages}
          </div>
        )}
        
        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrevPage}
              className={`p-2 rounded-lg border transition-all ${
                hasPrevPage
                  ? 'border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold/10 hover:border-luxury-gold'
                  : 'border-luxury-gold/10 text-luxury-ivory/30 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-luxury-ivory/40">
                      ...
                    </span>
                  );
                }
                
                const pageNum = page as number;
                const isActive = pageNum === currentPage;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-[40px] px-3 py-2 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-semibold'
                        : 'border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold/10 hover:border-luxury-gold'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className={`p-2 rounded-lg border transition-all ${
                hasNextPage
                  ? 'border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold/10 hover:border-luxury-gold'
                  : 'border-luxury-gold/10 text-luxury-ivory/30 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
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
              {editingProduct ? 'Edit Product' : 'Add New Product'}
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
                  <label className="block text-sm font-medium text-luxury-ivory mb-2">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                  >
                    {categories.length === 0 ? (
                      <option value="">Loading categories...</option>
                    ) : (
                      categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory mb-2">Fragrance Type</label>
                  <select
                    value={formData.fragranceType}
                    onChange={(e) => setFormData({ ...formData, fragranceType: e.target.value })}
                    className="w-full px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                  >
                    {fragranceTypes.length === 0 ? (
                      <option value="Oriental">Loading...</option>
                    ) : (
                      fragranceTypes.map((ft) => (
                        <option key={ft.id} value={ft.name}>
                          {ft.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory mb-2">Main Image</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, true);
                        }
                      }}
                      className="w-full px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-luxury-gold file:text-luxury-black hover:file:bg-luxury-gold-light"
                      disabled={uploading}
                    />
                    {imagePreview && (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-luxury-gold/20">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setFormData(prev => ({ ...prev, image: '' }));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    {uploading && (
                      <p className="text-sm text-luxury-gold">Uploading...</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory mb-2">Size</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-ivory mb-2">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                  />
                  <p className="text-xs text-luxury-ivory/50 mt-1">Enter discount percentage (0-100)</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-ivory mb-2">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-ivory mb-2">
                  Fragrance Notes (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.fragranceNotes}
                  onChange={(e) => setFormData({ ...formData, fragranceNotes: e.target.value })}
                  placeholder="Oud, Amber, Musk"
                  className="w-full px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-ivory mb-2">
                  Additional Images
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        handleMultipleImageUpload(files);
                      }
                    }}
                    className="w-full px-4 py-2 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-luxury-gold file:text-luxury-black hover:file:bg-luxury-gold-light"
                    disabled={uploading}
                  />
                  {additionalImagesPreview.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {additionalImagesPreview.map((url, index) => (
                        <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-luxury-gold/20">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = additionalImagesPreview.filter((_, i) => i !== index);
                              setAdditionalImagesPreview(newImages);
                              setFormData(prev => ({ ...prev, images: newImages.join(',') }));
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 text-luxury-gold bg-luxury-black border-luxury-gold/20 rounded focus:ring-luxury-gold"
                />
                <label htmlFor="inStock" className="text-sm text-luxury-ivory">
                  In Stock
                </label>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-luxury-gold text-luxury-black font-semibold rounded-lg hover:bg-luxury-gold-light transition-all"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
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

