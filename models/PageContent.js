import mongoose from 'mongoose';

const pageContentSchema = new mongoose.Schema({
  home: {
    heroTitle1: { type: String, default: 'Eat' },
    heroTitle2: { type: String, default: '&' },
    heroTitle3: { type: String, default: 'Out' },
    heroSubtitle: { type: String, default: 'Food is Happiness' },
    heroDescription: { type: String, default: 'Experience premium casual dining with authentic North Indian, Punjabi, Chinese, and Fast Food in the heart of Sri Muktsar Sahib.' },
    ctaButton1: { type: String, default: 'View Menu' },
    ctaButton2: { type: String, default: 'Book a Table' },
    popularDishesTitle: { type: String, default: 'Popular' },
    popularDishesSubtitle: { type: String, default: 'Dishes' },
    popularDishesText: { type: String, default: 'Discover our most loved dishes, crafted with authentic flavors' },
    heroBackgroundImage: { type: String, default: '/images/MAINPIC.png' },
    aboutSectionImage: { type: String, default: '/images/MAINPIC1.png' }
  },
  about: {
    title: { type: String, default: 'About' },
    subtitle: { type: String, default: 'Eat & Out' },
    tagline: { type: String, default: 'Food is Happiness' },
    welcomeTitle: { type: String, default: 'Welcome to Eat & Out' },
    description1: { type: String, default: 'Located in the vibrant Ranjit Avenue area of Sri Muktsar Sahib, Eat & Out is your destination for premium casual dining. We bring together the best of North Indian, Punjabi, Chinese, and Fast Food cuisines, all under one roof.' },
    description2: { type: String, default: 'Our restaurant is conveniently situated on Malout Road, near the Bus Stand, opposite Dhaliwal Eye Hospital. Whether you\'re looking for a quick bite or a full-course meal, we have something to satisfy every craving.' },
    description3: { type: String, default: 'We believe that food is happiness, and every dish we serve is crafted with passion, authentic flavors, and the finest ingredients.' },
    image: { type: String, default: '/images/MAINPIC2.png' }
  },
  gallery: {
    title: { type: String, default: 'Our' },
    subtitle: { type: String, default: 'Gallery' },
    description: { type: String, default: 'Take a visual journey through our restaurant, dishes, and dining experience.' },
    images: { type: [String], default: ['/images/MAINPIC.png', '/images/MAINPIC1.png', '/images/MAINPIC2.png', '/images/MAINPIC3.png'] }
  },
  contact: {
    title: { type: String, default: 'Contact' },
    subtitle: { type: String, default: 'Us' },
    description: { type: String, default: 'Have a question or want to make a reservation? We\'d love to hear from you!' },
    email: { type: String, default: 'info@eatandout.com' },
    phone: { type: String, default: '62837-71955' },
    locationTitle: { type: String, default: 'Location' },
    addressLine1: { type: String, default: 'Malout Road, Near Bus Stand' },
    addressLine2: { type: String, default: 'Opposite Dhaliwal Eye Hospital' },
    addressLine3: { type: String, default: 'Ranjit Avenue' },
    addressLine4: { type: String, default: 'Sri Muktsar Sahib, Punjab' }
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' }
  }
}, {
  timestamps: true
});

// Ensure only one document exists
pageContentSchema.statics.getSingleton = async function () {
  let content = await this.findOne();
  if (!content) {
    content = await this.create({});
  }
  return content;
};

export default mongoose.model('PageContent', pageContentSchema);
