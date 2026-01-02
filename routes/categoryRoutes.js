import express from 'express';
import Category from '../models/Category.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all categories (public - for menu display)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, displayName: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all categories including inactive (Admin only)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, displayName: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single category
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create category (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { displayName, description, order, isActive } = req.body;
    
    if (!displayName) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const name = displayName.toUpperCase().replace(/\s+/g, '_');

    // Check if category already exists
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      displayName: displayName.trim(),
      description: description?.trim() || '',
      order: order || 0,
      isActive: isActive !== false
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ message: error.message || 'Failed to create category' });
  }
});

// PUT update category (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { displayName, description, order, isActive } = req.body;
    
    const updateData = {};
    if (displayName) {
      updateData.displayName = displayName.trim();
      updateData.name = displayName.toUpperCase().replace(/\s+/g, '_');
    }
    if (description !== undefined) updateData.description = description.trim();
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ message: error.message || 'Failed to update category' });
  }
});

// DELETE category (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

