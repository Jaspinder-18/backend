import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'menu-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// GET all menu items
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    const menuItems = await MenuItem.find(query).sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single menu item
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create menu item (Admin only)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    console.log('Received menu item data:', req.body);
    console.log('File received:', req.file ? req.file.filename : 'No file');
    
    const { name, description, price, category, isAvailable, featured } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !category) {
      console.error('Validation failed - missing fields:', { name, description, price, category });
      return res.status(400).json({ 
        message: 'Missing required fields: name, description, price, and category are required' 
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : '';

    // Handle boolean conversion (FormData sends as strings)
    const isAvailableBool = isAvailable === 'true' || isAvailable === true || isAvailable === 'True';
    const featuredBool = featured === 'true' || featured === true || featured === 'True';

    const menuItem = new MenuItem({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      image,
      isAvailable: isAvailableBool,
      featured: featuredBool
    });

    const savedItem = await menuItem.save();
    console.log('Menu item saved successfully:', savedItem._id);
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    console.error('Error stack:', error.stack);
    res.status(400).json({ 
      message: error.message || 'Failed to create menu item',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT update menu item (Admin only)
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, featured } = req.body;
    
    // Handle boolean conversion (FormData sends as strings)
    const isAvailableBool = isAvailable === 'true' || isAvailable === true;
    const featuredBool = featured === 'true' || featured === true;
    
    const updateData = {
      name: name?.trim(),
      description: description?.trim(),
      price: price ? parseFloat(price) : undefined,
      category,
      isAvailable: isAvailableBool,
      featured: featuredBool
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(400).json({ message: error.message || 'Failed to update menu item' });
  }
});

// DELETE menu item (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

