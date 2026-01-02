import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import PageContent from './models/PageContent.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // 1. Seed Admin
    const existingAdmin = await Admin.findOne({ email: 'admin@eatandout.com' });
    if (existingAdmin) {
      console.log('Admin user already exists! Checking for updates...');
      if (!existingAdmin.dob) {
        existingAdmin.dob = '2000-01-01';
        await existingAdmin.save();
        console.log('Added missing DOB to existing admin');
      }
    } else {
      const admin = new Admin({
        email: 'admin@eatandout.com',
        password: 'admin123', // Will be hashed by pre-save hook
        dob: '2000-01-01'
      });
      await admin.save();
      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@eatandout.com');
      console.log('Password: admin123');
    }

    // 2. Seed Page Content
    const content = await PageContent.getSingleton();
    if (content) {
      console.log('✅ Page content initialized!');
    }

    console.log('Seeding process completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
