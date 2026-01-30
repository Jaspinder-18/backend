import mongoose from 'mongoose';
import MenuItem from './models/MenuItem.js';
import Category from './models/Category.js';
import PageContent from './models/PageContent.js';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!uri) {
            console.warn('Warning: No URI found in env, using local default.');
            uri = 'mongodb://localhost:27017/eatandout';
        }
        await mongoose.connect(uri);
        console.log('MongoDB connected to:', uri);
    } catch (err) {
        console.error('Connection error:', err.message);
        if (err.message.includes('ECONNREFUSED')) {
            try {
                await mongoose.connect('mongodb://127.0.0.1:27017/eatandout');
                console.log('Connected via 127.0.0.1');
                return;
            } catch (inner) { console.error(inner); }
        }
        process.exit(1);
    }
};

const menuData = [
    {
        category: 'Starters (Veg)',
        items: [
            { name: 'Paneer Tikka', price: 199, description: 'Succulent cubes of paneer marinated in yogurt and spices, grilled to perfection in a tandoor.', featured: true },
            { name: 'Veg Spring Rolls', price: 149, description: 'Crispy pastry sheets filled with a savory mixture of stir-fried vegetables.' },
            { name: 'Crispy Corn', price: 129, description: 'Deep-fried golden corn kernels tossed with aromatic spices and herbs.' },
            { name: 'Cheese Balls', price: 159, description: 'Melt-in-your-mouth cheese balls coated with breadcrumbs and fried until golden.' },
            { name: 'Veg Manchurian', price: 179, description: 'Deep-fried vegetable dumplings tossed in a tangy and spicy manchurian sauce.' },
            { name: 'Hara Bhara Kebab', price: 169, description: 'Spiced patties made with spinach, green peas, and potatoes.' }
        ]
    },
    {
        category: 'Starters (Non-Veg)',
        items: [
            { name: 'Chicken Tikka', price: 249, description: 'Classic tandoori chicken pieces marinated in yogurt and traditional Indian spices.', featured: true },
            { name: 'Chicken Wings', price: 199, description: 'Crispy chicken wings tossed in your choice of spicy or tangy sauce.' },
            { name: 'Chicken 65', price: 219, description: 'Spicy, deep-fried chicken pieces tempered with curry leaves and green chilies.' },
            { name: 'Fish Fry', price: 279, description: 'Crispy, spiced fish fillets deep-fried to a perfect golden brown.' },
            { name: 'Mutton Seekh Kebab', price: 299, description: 'Minced mutton mixed with aromatic spices, skewed and grilled to perfection.' }
        ]
    },
    {
        category: 'Italian & Continental',
        items: [
            { name: 'White Sauce Pasta', price: 199, description: 'Penne pasta tossed in a rich, creamy, and cheesy white sauce.' },
            { name: 'Red Sauce Pasta', price: 189, description: 'Penne pasta sautéed in a tangy and spicy tomato-based arrabbiata sauce.' },
            { name: 'Mix Sauce Pasta', price: 209, description: 'The best of both worlds - pasta in a perfect blend of red and white sauces.' },
            { name: 'Garlic Bread', price: 99, description: 'Toasted bread infused with garlic butter and herbs.' },
            { name: 'Cheese Garlic Bread', price: 129, description: 'Garlic bread topped with a generous layer of melted mozzarella cheese.' },
            {
                name: 'Veg Pizza',
                description: 'Classic pizza topped with fresh vegetables, tomato sauce, and mozzarella.',
                featured: true,
                variants: [
                    { name: 'Small', price: 199 },
                    { name: 'Medium', price: 249 },
                    { name: 'Large', price: 349 }
                ]
            },
            {
                name: 'Chicken Pizza',
                description: 'Delicious pizza topped with spiced chicken chunks and melted cheese.',
                variants: [
                    { name: 'Small', price: 249 },
                    { name: 'Medium', price: 299 },
                    { name: 'Large', price: 449 }
                ]
            },
            { name: 'Veg Burger', price: 149, description: 'Crispy vegetable patty with fresh lettuce, onions, and creamy mayo in a soft bun.' },
            { name: 'Chicken Burger', price: 199, description: 'Juicy chicken patty with special sauce and fresh toppings.' }
        ]
    },
    {
        category: 'Punjabi Main Course (Veg)',
        items: [
            { name: 'Shahi Paneer', price: 229, description: 'Cottage cheese cubes in a rich, creamy, and mildly spicy tomato-cashew gravy.', featured: true },
            { name: 'Kadai Paneer', price: 219, description: 'Paneer cooked with bell peppers and freshly ground spices in a traditional kadai.' },
            { name: 'Butter Paneer', price: 239, description: 'Creamy paneer pieces in a smooth, buttery tomato-based makhani gravy.' },
            { name: 'Dal Makhani', price: 179, description: 'Black lentils slow-cooked overnight with cream and butter for a rich flavor.' },
            { name: 'Mix Veg', price: 169, description: 'A seasonal selection of fresh vegetables cooked with Indian spices.' },
            { name: 'Chole Bhature', price: 149, description: 'Spiced chickpea curry served with two fluffy, deep-fried leavened breads.' }
        ]
    },
    {
        category: 'Punjabi Main Course (Non-Veg)',
        items: [
            { name: 'Butter Chicken', price: 299, description: 'The legendary Punjabi dish - grilled chicken in a rich, creamy tomato gravy.', featured: true },
            { name: 'Chicken Curry', price: 269, description: 'Homestyle chicken curry cooked with traditional spices and herbs.' },
            { name: 'Kadai Chicken', price: 289, description: 'Chicken cooked with whole spices and bell peppers in a kadai.' },
            { name: 'Mutton Curry', price: 349, description: 'Tender mutton pieces slow-cooked in a spicy and flavorful gravy.' },
            { name: 'Fish Curry', price: 329, description: 'Traditional fish curry with a perfect balance of spices and tanginess.' }
        ]
    },
    {
        category: 'Rice & Biryani',
        items: [
            { name: 'Veg Fried Rice', price: 149, description: 'Stir-fried rice with assorted vegetables and Chinese seasonings.' },
            { name: 'Chicken Fried Rice', price: 199, description: 'Classic Chinese-style fried rice with chicken chunks and egg.' },
            { name: 'Veg Biryani', price: 199, description: 'Fragrant basmati rice cooked with mixed vegetables and aromatic spices.' },
            { name: 'Chicken Biryani', price: 249, description: 'Long-grain basmati rice layered with spiced chicken and cooked on Dum.', featured: true },
            { name: 'Mutton Biryani', price: 349, description: 'The king of biryanis - slow-cooked basmati rice with tender spiced mutton.' },
            { name: 'Jeera Rice', price: 119, description: 'Aromatic basmati rice tempered with cumin seeds.' }
        ]
    },
    {
        category: 'Breads',
        items: [
            { name: 'Tandoori Roti', price: 20, description: 'Whole wheat bread cooked in a traditional clay oven.' },
            { name: 'Butter Roti', price: 25, description: 'Soft tandoori roti glazed with fresh butter.' },
            { name: 'Plain Naan', price: 40, description: 'Fluffy, fine flour leavened bread baked in the tandoor.' },
            { name: 'Butter Naan', price: 50, description: 'Classic naan bread generously topped with butter.' },
            { name: 'Garlic Naan', price: 60, description: 'Naan bread infused with chopped garlic and coriander.' },
            { name: 'Stuffed Paratha', price: 70, description: 'Whole wheat bread stuffed with your choice of spiced potatoes or vegetables.' }
        ]
    },
    {
        category: 'Fast Food',
        items: [
            { name: 'French Fries', price: 99, description: 'Crispy golden potato fingers served with dip.' },
            { name: 'Cheese Fries', price: 129, description: 'Classic french fries topped with a warm, melted cheese sauce.' },
            { name: 'Veg Momos', price: 99, description: 'Steamed dumplings filled with finely chopped vegetables and spices.' },
            { name: 'Chicken Momos', price: 149, description: 'Juicy steamed dumplings filled with minced chicken and herbs.' },
            { name: 'Sandwich', price: 129, description: 'Grilled sandwich with fresh vegetables and creamy spread.' },
            { name: 'Cheese Sandwich', price: 159, description: 'Triple-layered grilled sandwich loaded with melted cheese and veggies.' }
        ]
    },
    {
        category: 'Desserts',
        items: [
            { name: 'Gulab Jamun', price: 79, description: 'Warm, syrupy milk dumplings - a classic Indian dessert favorite.' },
            { name: 'Rasgulla', price: 69, description: 'Spongy, white cheese balls soaked in a light sugar syrup.' },
            { name: 'Ice Cream', price: 99, description: 'Two scoops of your favorite flavor - Vanilla, Chocolate, or Strawberry.' },
            { name: 'Brownie with Ice Cream', price: 149, description: 'Warm walnut brownie served with a scoop of vanilla ice cream and chocolate syrup.' },
            { name: 'Rabri', price: 129, description: 'Rich, thickened milk dessert flavored with cardamom and saffron.' }
        ]
    },
    {
        category: 'Beverages',
        items: [
            { name: 'Cold Coffee', price: 129, description: 'Creamy and refreshing blended coffee served chilled.' },
            { name: 'Hot Coffee', price: 79, description: 'A perfectly brewed cup of classic hot coffee.' },
            { name: 'Tea', price: 30, description: 'Traditional Indian masala chai brewed with ginger and cardamom.' },
            { name: 'Fresh Lime Soda', price: 69, description: 'Bubbly lime juice served sweet, salt, or mixed.' },
            { name: 'Mojito', price: 129, description: 'Classic refreshing drink with mint, lime, and a splash of soda.' },
            { name: 'Soft Drinks', price: 49, description: 'Your choice of chilled carbonated beverage.' }
        ]
    }
];

const seedAll = async () => {
    try {
        await connectDB();

        // 1. Clear everything
        console.log('Clearing database...');
        await MenuItem.deleteMany({});
        await Category.deleteMany({});
        await PageContent.deleteMany({});
        await Admin.deleteMany({});

        // 2. Add Admin
        const admin = new Admin({
            email: 'admin@eatandout.com',
            password: 'admin123',
            dob: '2000-01-01'
        });
        await admin.save();
        console.log('Admin created: admin@eatandout.com / admin123');

        // 3. Add Categories and Items
        for (let i = 0; i < menuData.length; i++) {
            const catData = menuData[i];
            const category = new Category({
                name: catData.category.toUpperCase().replace(/\s+/g, '_'),
                displayName: catData.category,
                order: i + 1,
                isActive: true
            });
            await category.save();

            const items = catData.items.map(item => ({ ...item, category: catData.category }));
            await MenuItem.insertMany(items);
            console.log(`Seeded category: ${catData.category}`);
        }

        // 4. Add Page Content with explicit Menu section
        const content = new PageContent({
            home: {
                heroTitle1: 'Eat',
                heroTitle2: '&',
                heroTitle3: 'Out',
                heroSubtitle: 'Refreshed & Delicious',
                heroDescription: 'Experience our newly updated menu featuring authenic flavors and premium ingredients.',
                ctaButton1: 'Order Now',
                ctaButton2: 'Contact Us',
                popularDishesTitle: 'Popular',
                popularDishesSubtitle: 'Selections',
                popularDishesText: 'Hand-picked favorites from our revised menu.',
                heroBackgroundImage: '/images/MAINPIC.png',
                aboutSectionImage: '/images/MAINPIC1.png'
            },
            menu: {
                title: 'Our',
                subtitle: 'New Menu',
                description: 'We have refreshed our offerings with new delicious additions and better variety.'
            }
            // Other sections will use defaults from the model
        });
        await content.save();
        console.log('Page content updated successfully!');

        console.log('ALL DATA SEEDED SUCCESSFULLY!');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seedAll();
