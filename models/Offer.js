import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String, // Short description
        required: true,
        trim: true
    },
    image: {
        type: String, // URL/Path to image
        required: true
    },
    category: {
        type: String, // e.g., 'Dessert', 'Pizza'
        required: true
    },
    buttonText: {
        type: String,
        default: 'Claim Offer'
    },
    redirectLink: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    displayLocation: {
        type: [String], // ['Homepage Popup', 'Menu Page', 'Product Page', 'Dashboard Banner']
        default: ['Homepage Popup']
    }
}, {
    timestamps: true
});

// Middleware to auto-disable if end date passed (simplified check on find could be better, but this works on save)
offerSchema.pre('save', function (next) {
    if (this.endDate && new Date() > this.endDate) {
        this.isActive = false;
    }
    next();
});

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
