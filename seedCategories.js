import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Category from './models/Category.js';

dotenv.config();

const defaultCategories = [
  { displayName: 'Punjabi', description: 'Authentic Punjabi cuisine', order: 1 },
  { displayName: 'Chinese', description: 'Delicious Chinese dishes', order: 2 },
  { displayName: 'Fast Food', description: 'Quick and tasty fast food', order: 3 },
  { displayName: 'North Indian', description: 'Traditional North Indian food', order: 4 }
];

const seedCategories = async () => {
  try {
    await connectDB();

    for (const cat of defaultCategories) {
      const name = cat.displayName.toUpperCase().replace(/\s+/g, '_');
      const existing = await Category.findOne({ name });
      
      if (!existing) {
        const category = new Category({
          name,
          displayName: cat.displayName,
          description: cat.description,
          order: cat.order,
          isActive: true
        });
        await category.save();
        console.log(`✅ Created category: ${cat.displayName}`);
      } else {
        console.log(`⏭️  Category already exists: ${cat.displayName}`);
      }
    }

    console.log('✅ Categories seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();

