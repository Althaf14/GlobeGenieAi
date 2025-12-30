import Expense from '../models/Expense.js';

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
    try {
        const { travelCost, hotelCost, foodCost, activityCost, description } = req.body;

        const travel = Number(travelCost) || 0;
        const hotel = Number(hotelCost) || 0;
        const food = Number(foodCost) || 0;
        const activity = Number(activityCost) || 0;

        const totalCost = travel + hotel + food + activity;

        const expense = await Expense.create({
            userId: req.user._id,
            travelCost: travel,
            hotelCost: hotel,
            foodCost: food,
            activityCost: activity,
            totalCost,
            description
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Server Error adding expense', error: error.message });
    }
};

// @desc    Get user expenses
// @route   GET /api/expenses/:userId
// @access  Private
const getUserExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching expenses', error: error.message });
    }
};

export { addExpense, getUserExpenses };
