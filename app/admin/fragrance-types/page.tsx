'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, X, Edit } from 'lucide-react';
import { BASE_URL } from '@/lib/config';

interface FragranceType {
  id: string;
  name: string;
  description?: string;
}

export default function AdminFragranceTypes() {
  const [fragranceTypes, setFragranceTypes] = useState<FragranceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFragranceType, setEditingFragranceType] = useState<FragranceType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchFragranceTypes();
  }, []);

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
      }
    } catch (error) {
      console.error('Error fetching fragrance types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingFragranceType
        ? `${BASE_URL}/api/fragrance-types/${editingFragranceType.id}`
        : `${BASE_URL}/api/fragrance-types`;
      const method = editingFragranceType ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
        }),
      });

      if (response.ok) {
        setFormData({ name: '', description: '' });
        setEditingFragranceType(null);
        setShowModal(false);
        fetchFragranceTypes();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error saving fragrance type');
      }
    } catch (error) {
      console.error('Error saving fragrance type:', error);
      alert('Error saving fragrance type');
    }
  };

  const handleEdit = (fragranceType: FragranceType) => {
    setEditingFragranceType(fragranceType);
    setFormData({
      name: fragranceType.name,
      description: fragranceType.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (fragranceType: FragranceType) => {
    if (!confirm(`Are you sure you want to delete "${fragranceType.name}"?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/api/fragrance-types/${fragranceType.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchFragranceTypes();
      }
    } catch (error) {
      console.error('Error deleting fragrance type:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display text-luxury-gold mb-2">Fragrance Types</h1>
          <p className="text-luxury-ivory/60">Manage fragrance types for products</p>
        </div>
        <button
          onClick={() => {
            setEditingFragranceType(null);
            setFormData({ name: '', description: '' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-luxury-gold text-luxury-black font-semibold rounded-lg hover:bg-luxury-gold-light transition-all"
        >
          <Plus size={20} />
          Add Fragrance Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-luxury-ivory/60 py-12">Loading...</div>
        ) : fragranceTypes.length === 0 ? (
          <div className="col-span-full text-center text-luxury-ivory/60 py-12">No fragrance types found</div>
        ) : (
          fragranceTypes.map((fragranceType, index) => (
            <motion.div
              key={fragranceType.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-luxury-charcoal border border-luxury-gold/20 rounded-xl p-6 hover:border-luxury-gold/40 transition-all"
            >
              <h3 className="text-xl font-semibold text-luxury-ivory mb-2">{fragranceType.name}</h3>
              {fragranceType.description && (
                <p className="text-sm text-luxury-ivory/60 mb-4 line-clamp-2">{fragranceType.description}</p>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(fragranceType)}
                  className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all text-sm font-medium"
                >
                  <Edit size={16} className="inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(fragranceType)}
                  className="px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-charcoal border border-luxury-gold/20 rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display text-luxury-gold">
                {editingFragranceType ? 'Edit Fragrance Type' : 'Add Fragrance Type'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ name: '', description: '' });
                  setEditingFragranceType(null);
                }}
                className="text-luxury-ivory/60 hover:text-luxury-ivory"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-luxury-ivory mb-2">
                  Fragrance Type Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Oriental, Floral, Woody"
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
                  placeholder="e.g., Warm, spicy, and exotic scents"
                  rows={3}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-lg text-luxury-ivory focus:outline-none focus:border-luxury-gold"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-luxury-gold text-luxury-black font-semibold rounded-lg hover:bg-luxury-gold-light transition-all"
                >
                  {editingFragranceType ? 'Update Fragrance Type' : 'Add Fragrance Type'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ name: '', description: '' });
                    setEditingFragranceType(null);
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

