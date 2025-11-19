'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, X, Edit } from 'lucide-react';
import { BASE_URL } from '@/lib/config';

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // Filter out 'All' if it exists and ensure it's an array of objects
      const filteredCategories = Array.isArray(data) 
        ? data.filter((c: any) => c.name !== 'All' && typeof c === 'object')
        : [];
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
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
        setFormData(prev => ({ ...prev, image: data.url }));
        setImagePreview(data.url);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingCategory
        ? `${BASE_URL}/api/categories/${editingCategory.id}`
        : `${BASE_URL}/api/categories`;
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          image: formData.image,
        }),
      });

      if (response.ok) {
        setFormData({ name: '', description: '', image: '' });
        setImagePreview('');
        setEditingCategory(null);
        setShowModal(false);
        fetchCategories();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error saving category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
    });
    setImagePreview(category.image || '');
    setShowModal(true);
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/categories/${encodeURIComponent(category.name)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display text-luxury-gold mb-2">Categories</h1>
          <p className="text-luxury-ivory/60">Manage product categories</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', description: '', image: '' });
            setImagePreview('');
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-luxury-gold text-luxury-black font-semibold rounded-lg hover:bg-luxury-gold-light transition-all"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-luxury-ivory/60 py-12">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center text-luxury-ivory/60 py-12">No categories found</div>
        ) : (
          categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-luxury-charcoal border border-luxury-gold/20 rounded-xl overflow-hidden hover:border-luxury-gold/40 transition-all"
            >
              {category.image && (
                <div className="relative w-full h-48 bg-luxury-black">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-luxury-ivory mb-2">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-luxury-ivory/60 mb-4 line-clamp-2">{category.description}</p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all text-sm font-medium"
                  >
                    <Edit size={16} className="inline mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-charcoal border border-luxury-gold/20 rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display text-luxury-gold">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ name: '', description: '', image: '' });
                  setImagePreview('');
                  setEditingCategory(null);
                }}
                className="text-luxury-ivory/60 hover:text-luxury-ivory"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-luxury-ivory mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Oriental, Spicy"
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-ivory mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Rich oud, sandalwood, and amber scents"
                  rows={3}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-ivory mb-2">
                  Category Image
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file);
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
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-luxury-gold text-luxury-black font-semibold rounded-lg hover:bg-luxury-gold-light transition-all"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ name: '', description: '', image: '' });
                    setImagePreview('');
                    setEditingCategory(null);
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

