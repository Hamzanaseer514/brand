import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import FragranceType from '../models/FragranceType.js';

const router = express.Router();

// Get all fragrance types
router.get('/', async (req, res) => {
  try {
    let fragranceTypes = await FragranceType.find({}).sort({ name: 1 });
    
    // If no fragrance types exist, seed default ones
    if (fragranceTypes.length === 0) {
      const defaultFragranceTypes = [
        { name: 'Oriental', description: 'Warm, spicy, and exotic scents' },
        { name: 'Floral', description: 'Delicate flower-based fragrances' },
        { name: 'Floral Oriental', description: 'A blend of floral and oriental notes' },
        { name: 'Woody', description: 'Rich wood and earthy scents' },
        { name: 'Fresh', description: 'Crisp, clean, and invigorating' },
      ];
      await FragranceType.insertMany(defaultFragranceTypes);
      fragranceTypes = await FragranceType.find({}).sort({ name: 1 });
    }
    
    res.json(fragranceTypes);
  } catch (error) {
    console.error('Error fetching fragrance types:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create fragrance type (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const newFragranceType = new FragranceType({
      name: name.trim(),
      description: description || '',
    });

    const savedFragranceType = await newFragranceType.save();
    res.status(201).json(savedFragranceType);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Fragrance type already exists' });
    }
    console.error('Error creating fragrance type:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update fragrance type (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedFragranceType = await FragranceType.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim(),
        description: description || '',
      },
      { new: true, runValidators: true }
    );

    if (!updatedFragranceType) {
      return res.status(404).json({ error: 'Fragrance type not found' });
    }

    res.json(updatedFragranceType);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Fragrance type already exists' });
    }
    console.error('Error updating fragrance type:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete fragrance type (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedFragranceType = await FragranceType.findByIdAndDelete(req.params.id);

    if (!deletedFragranceType) {
      return res.status(404).json({ error: 'Fragrance type not found' });
    }

    res.json({ message: 'Fragrance type deleted successfully' });
  } catch (error) {
    console.error('Error deleting fragrance type:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

