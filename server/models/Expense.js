import mongoose from 'mongoose';

const expenseSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    travelCost: {
        type: Number,
        default: 0
    },
    hotelCost: {
        type: Number,
        default: 0
    },
    foodCost: {
        type: Number,
        default: 0
    },
    activityCost: {
        type: Number,
        default: 0
    },
    totalCost: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
