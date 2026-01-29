import express from 'express';
import multer from 'multer';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const router = express.Router();

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Configure storage (Memory storage for ImageKit)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload endpoint
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to ImageKit
        const result = await imagekit.upload({
            file: req.file.buffer, // required
            fileName: req.file.originalname, // required
            folder: '/eat-and-out/' // Optional: Organize images in a folder
        });

        res.json({
            message: 'File uploaded successfully',
            filePath: result.url,
            fileId: result.fileId,
            thumbnailUrl: result.thumbnailUrl
        });

    } catch (error) {
        console.error('ImageKit upload error:', error);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

export default router;
