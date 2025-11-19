import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Order from '../models/Order.js';
import { sendInvoiceEmail, sendAdminNotificationEmail } from '../utils/emailService.js';

const router = express.Router();

// Get all orders (Admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single order by ID (Public - for tracking)
router.get('/track/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Return order without sensitive information
    const orderData = order.toJSON ? order.toJSON() : order;
    res.json(orderData);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single order (Admin only)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create order
router.post('/', async (req, res) => {
  let savedOrder = null;
  
  try {
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      total,
    } = req.body;

    // Validate all required fields first
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !total) {
      return res.status(400).json({ error: 'Missing required fields (name, email, phone, address, total)' });
    }

    // Validate shipping address structure
    if (typeof shippingAddress === 'object') {
      if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
        return res.status(400).json({ error: 'Complete shipping address is required (address, city, state, zipCode, country)' });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone number (required and should not be empty)
    if (!customerPhone || customerPhone.trim().length === 0) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Basic phone validation (at least 10 digits, can include +, -, spaces, parentheses)
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(customerPhone.replace(/\s/g, ''))) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Validate numeric fields
    const totalNum = parseFloat(total);
    const subtotalNum = parseFloat(subtotal) || totalNum;
    const taxNum = parseFloat(tax) || 0;

    if (isNaN(totalNum) || totalNum <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    // Validate items
    for (const item of items) {
      if (!item.name || !item.price || !item.quantity) {
        return res.status(400).json({ error: 'All items must have name, price, and quantity' });
      }
      if (isNaN(parseFloat(item.price)) || parseFloat(item.price) <= 0) {
        return res.status(400).json({ error: 'Invalid item price' });
      }
      if (isNaN(parseInt(item.quantity)) || parseInt(item.quantity) <= 0) {
        return res.status(400).json({ error: 'Invalid item quantity' });
      }
    }

    // Create order
    const newOrder = new Order({
      items,
      customerName,
      customerEmail,
      customerPhone: customerPhone.trim(),
      shippingAddress,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      subtotal: subtotalNum,
      tax: taxNum,
      total: totalNum,
      status: 'pending',
    });

    savedOrder = await newOrder.save();

    // Convert to JSON to ensure id field is available (from toJSON transform)
    const orderForEmail = savedOrder.toJSON ? savedOrder.toJSON() : savedOrder;

    // Send invoice email to customer - if this fails, rollback the order
    const customerEmailResult = await sendInvoiceEmail(orderForEmail);
    
    if (!customerEmailResult.success) {
      // Delete the order if customer email fails
      await Order.findByIdAndDelete(savedOrder._id);
      console.error('Order creation failed - customer email error:', customerEmailResult.error);
      return res.status(500).json({ 
        error: 'Failed to send invoice email. Order was not created. Please check your email configuration and try again.' 
      });
    }

    // Send admin notification email - MUST be sent, if this fails, rollback the order
    const adminEmailResult = await sendAdminNotificationEmail(orderForEmail);
    if (!adminEmailResult.success) {
      // Delete the order if admin email fails
      await Order.findByIdAndDelete(savedOrder._id);
      console.error('Order creation failed - admin email error:', adminEmailResult.error);
      return res.status(500).json({ 
        error: 'Failed to send admin notification email. Order was not created. Please check your ADMIN_EMAIL configuration and try again.' 
      });
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    // If order was created but something else failed, delete it
    if (savedOrder && savedOrder._id) {
      try {
        await Order.findByIdAndDelete(savedOrder._id);
      } catch (deleteError) {
        console.error('Error deleting order after failure:', deleteError);
      }
    }
    
    console.error('Error creating order:', error);
    
    // Return specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: `Validation error: ${error.message}` });
    }
    
    res.status(500).json({ error: 'Server error: Failed to create order. Please try again.' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete order (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

