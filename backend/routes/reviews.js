import express from 'express';
import mongoose from 'mongoose';
import { authenticateToken } from '../middleware/auth.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const { productId } = req.query;
    let query = {};
    
    if (productId) {
      // Convert productId string to ObjectId if needed
      if (mongoose.Types.ObjectId.isValid(productId)) {
        query.productId = productId;
      }
    }

    const reviews = await Review.find(query).sort({ date: -1 }); // Sort by date, newest first
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create review
router.post('/', async (req, res) => {
  try {
    const { productId, name, email, rating, comment } = req.body;

    if (!productId || !name || !email || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newReview = new Review({
      productId,
      name,
      email,
      rating: parseInt(rating),
      comment,
      date: new Date(),
    });

    const savedReview = await newReview.save();

    // Update product rating
    const productReviews = await Review.find({ productId });
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewsCount: productReviews.length,
    });

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update review (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Update product rating if rating changed
    if (req.body.rating !== undefined) {
      const productReviews = await Review.find({ productId: updatedReview.productId });
      const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      
      await Product.findByIdAndUpdate(updatedReview.productId, {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewsCount: productReviews.length,
      });
    }

    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete review (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    const productReviews = await Review.find({ productId });
    if (productReviews.length > 0) {
      const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      await Product.findByIdAndUpdate(productId, {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewsCount: productReviews.length,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        reviewsCount: 0,
      });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

