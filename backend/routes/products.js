import express from 'express';
import mongoose from 'mongoose';
import { authenticateToken } from '../middleware/auth.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products (with optional pagination for admin panel)
router.get('/', async (req, res) => {
  try {
    // Check if pagination is requested (for admin panel)
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const search = req.query.search || '';
    const category = req.query.category || '';
    const fragranceType = req.query.fragranceType || '';
    
    // If pagination params are provided, return paginated response
    if (page && limit) {
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

      // Build query
      const query = {};
      
      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ];
      }
      
      // Category filter
      if (category) {
        query.category = category;
      }
      
      // Fragrance type filter
      if (fragranceType) {
        query.fragranceType = fragranceType;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Get total count for pagination
      const total = await Product.countDocuments(query);
      
      // Get products with pagination
      const products = await Product.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit);

      // Calculate total pages
      const totalPages = Math.ceil(total / limit);

      // Return paginated response
      return res.json({
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    }
    
    // Default: return all products (for home/shop pages)
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`Invalid ObjectId format: ${id}`);
      return res.status(400).json({ error: 'Invalid product ID format' });
    }
    
    // Convert string to ObjectId
    const objectId = new mongoose.Types.ObjectId(id);
    
    // Find product by _id
    const product = await Product.findById(objectId);
    
    // If not found, return 404
    if (!product) {
      console.log(`Product not found for ID: ${id}`);
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      images,
      category,
      fragranceType,
      fragranceNotes,
      rating,
      reviewsCount,
      inStock,
      size,
      discount,
    } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Ensure images is an array
    let imagesArray = [];
    if (images) {
      imagesArray = Array.isArray(images) ? images : [];
    }
    // If no images provided, use main image
    if (imagesArray.length === 0 && image) {
      imagesArray = [image];
    }

    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      image: image || '/images/1.png',
      images: imagesArray,
      category,
      fragranceType: fragranceType || 'Oriental',
      fragranceNotes: Array.isArray(fragranceNotes) ? fragranceNotes : [],
      rating: parseFloat(rating) || 0,
      reviewsCount: parseInt(reviewsCount) || 0,
      inStock: inStock !== undefined ? inStock : true,
      size: size || '50ml',
      discount: parseFloat(discount) || 0,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      images,
      category,
      fragranceType,
      fragranceNotes,
      rating,
      reviewsCount,
      inStock,
      size,
      discount,
    } = req.body;

    // Prepare update object
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (image !== undefined) updateData.image = image;
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : [];
    if (category !== undefined) updateData.category = category;
    if (fragranceType !== undefined) updateData.fragranceType = fragranceType;
    if (fragranceNotes !== undefined) {
      updateData.fragranceNotes = Array.isArray(fragranceNotes) 
        ? fragranceNotes 
        : (typeof fragranceNotes === 'string' 
          ? fragranceNotes.split(',').map((n) => n.trim()).filter(Boolean)
          : []);
    }
    if (rating !== undefined) updateData.rating = parseFloat(rating);
    if (reviewsCount !== undefined) updateData.reviewsCount = parseInt(reviewsCount);
    if (inStock !== undefined) updateData.inStock = inStock;
    if (size !== undefined) updateData.size = size;
    if (discount !== undefined) updateData.discount = parseFloat(discount) || 0;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

