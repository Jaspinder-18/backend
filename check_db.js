import mongoose from 'mongoose';
import MenuItem from './models/MenuItem.js';
import Category from './models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

const checkDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/eatandout';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);

        const menuCount = await MenuItem.countDocuments();
        const catCount = await Category.countDocuments();

        console.log('Menu Items Count:', menuCount);
        console.log('Categories Count:', catCount);

        if (menuCount > 0) {
            const firstItem = await MenuItem.findOne();
            console.log('First Item Name:', firstItem.name);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
