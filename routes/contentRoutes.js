import express from 'express';
import PageContent from '../models/PageContent.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET page content (Public)
router.get('/', async (req, res) => {
    try {
        const content = await PageContent.getSingleton();
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update page content (Admin only)
router.put('/', authenticateToken, async (req, res) => {
    try {
        let content = await PageContent.findOne();
        if (!content) {
            content = new PageContent();
        }

        // Update fields recursively or using Object.assign for top-level keys
        // Since request body structure matches schema structure:
        if (req.body.home) content.home = { ...content.home, ...req.body.home };
        if (req.body.about) content.about = { ...content.about, ...req.body.about };
        if (req.body.gallery) content.gallery = { ...content.gallery, ...req.body.gallery };
        if (req.body.contact) content.contact = { ...content.contact, ...req.body.contact };
        if (req.body.socialLinks) content.socialLinks = { ...content.socialLinks, ...req.body.socialLinks };

        const updatedContent = await content.save();
        res.json(updatedContent);
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(400).json({ message: error.message || 'Failed to update content' });
    }
});

export default router;
