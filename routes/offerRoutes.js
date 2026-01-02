import express from 'express';
import Offer from '../models/Offer.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer setup (reuse if possible, but for now simple setup)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'offer-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// GET all active offers (Public)
router.get('/active', async (req, res) => {
    try {
        const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET all offers (Admin)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const offers = await Offer.find({}).sort({ createdAt: -1 });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create offer (Admin)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { title, description, isActive } = req.body;
        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const offer = new Offer({
            title,
            description,
            image: imagePath,
            isActive: isActive === 'true'
        });

        await offer.save();
        res.status(201).json(offer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating offer' });
    }
});

// PUT update offer
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { title, description, isActive } = req.body;
        const updateData = {
            title,
            description,
            isActive: isActive === 'true'
        };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const offer = await Offer.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        res.json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE offer
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Offer deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT toggle active status
router.put('/:id/toggle', authenticateToken, async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });

        offer.isActive = !offer.isActive;
        await offer.save();
        res.json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
