import express from 'express';
import { addExpense, getUserExpenses } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addExpense);
router.get('/:userId', protect, getUserExpenses);

export default router;
