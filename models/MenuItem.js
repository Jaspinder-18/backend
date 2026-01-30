import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: function () { return !this.variants || this.variants.length === 0; },
    min: 0
  },
  variants: [
    {
      name: { type: String, required: true }, // e.g., 'Small', 'Medium', 'Large'
      price: { type: Number, required: true, min: 0 }
    }
  ],
  category: {
    type: String,
    required: true,
    index: true
  },
  image: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('MenuItem', menuItemSchema);

