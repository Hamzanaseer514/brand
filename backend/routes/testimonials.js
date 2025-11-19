import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({});
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single testimonial
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create testimonial (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, rating, comment, location } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newTestimonial = new Testimonial({
      name,
      rating: parseInt(rating),
      comment,
      location: location || '',
    });

    const savedTestimonial = await newTestimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update testimonial (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(updatedTestimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete testimonial (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!deletedTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

