import express from 'express';
import Order from '../models/Order.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all orders (Admin/Manager)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET dashboard stats (Admin)
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = totalRevenueResult[0]?.total || 0;

        // Simple daily visitors mock (since we don't track visits yet)
        const dailyVisitors = 120; // Mock

        // Popular dishes
        const popularDishes = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { _id: '$items.name', count: { $sum: '$items.quantity' } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            totalOrders,
            totalRevenue,
            dailyVisitors,
            popularDishes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Order Status
router.put('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
