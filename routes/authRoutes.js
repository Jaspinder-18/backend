import express from 'express';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, dob, newPassword } = req.body;

    if (!email || !dob || !newPassword) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      // For security, generic message might be better, but for this app specific is fine as per request
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.dob !== dob) {
      return res.status(401).json({ message: 'Invalid Date of Birth' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

