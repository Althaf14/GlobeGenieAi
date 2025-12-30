import mongoose from 'mongoose';

const tripSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    destination: {
        type: String,
        required: false // Optional if generated generically
    },
    duration: {
        type: Number,
        required: true
    },
    budget: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    totalCost: {
        type: Number, // Estimated or actual total
        default: 0
    },
    itinerary: [{
        day: { type: Number, required: true },
        activities: [{
            time: String,
            activity: String,
            type: { type: String },
            cost: String,
            visited: {
                type: Boolean,
                default: false
            }
        }]
    }]
}, {
    timestamps: true
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
