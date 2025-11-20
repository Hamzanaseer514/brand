import express from 'express';
import { sendContactFormEmail } from '../utils/emailService.js';

const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required (name, email, message)' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Send email to admin
    const emailResult = await sendContactFormEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    if (!emailResult.success) {
      console.error('Error sending contact form email:', emailResult.error);
      return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully. We will get back to you soon!' 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

