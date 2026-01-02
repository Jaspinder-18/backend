import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// POST create contact message
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    console.log('Received contact form data:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      // Return first error message for simplicity, or all errors
      const errorMessages = errors.array().map(err => err.msg).join(', ');
      return res.status(400).json({ 
        message: errorMessages,
        errors: errors.array() 
      });
    }

    const { name, email, phone, message } = req.body;
    const contactMessage = new ContactMessage({ name, email, phone, message });
    await contactMessage.save();
    
    console.log('Contact message saved successfully:', contactMessage._id);
    res.status(201).json({ message: 'Thank you for contacting us! We will get back to you soon.' });
  } catch (error) {
    console.error('Contact form error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message || 'Failed to send message. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET all contact messages (Admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT mark message as read (Admin only)
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

