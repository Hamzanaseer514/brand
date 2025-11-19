import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Category from '../models/Category.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    let categories = await Category.find({});
    
    // If no categories exist, seed default ones
    if (categories.length === 0) {
      const defaultCategories = [
        { name: 'Woody', description: 'Rich oud, sandalwood, and amber scents', image: '/images/1.png' },
        { name: 'Floral', description: 'Delicate roses, jasmine, and gardenia', image: '/images/2.png' },
        { name: 'Fresh', description: 'Crisp citrus and aquatic notes', image: '/images/3.png' },
      ];
      await Category.insertMany(defaultCategories);
      categories = await Category.find({});
    }
    
    // Return full category objects with name, description, and image
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add category (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const newCategory = new Category({
      name: name.trim(),
      description: description || '',
      image: image || '',
    });
    await newCategory.save();

    // Return all categories
    const categories = await Category.find({});
    res.status(201).json(categories);
  } catch (error) {
    console.error('Error adding category:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update category (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim(),
        description: description?.trim() || '',
        image: image || '',
      },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete category (Admin only)
router.delete('/:name', authenticateToken, async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({ name: req.params.name });

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

