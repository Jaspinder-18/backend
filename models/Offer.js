import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String, // URL/Path to image
        required: true
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
    }
}, {
    timestamps: true
});

// Ensure only one active offer is shown/prioritized if needed, or allow multiple.
// For now, allow multiple, frontend can show latest.

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
