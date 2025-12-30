import mongoose from 'mongoose';

const placeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String, // e.g., 'Nature', 'Historical', 'Adventure', 'Cultural'
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Place = mongoose.model('Place', placeSchema);

export default Place;
