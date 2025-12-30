import express from 'express';
import { createTrip, getUserTrips, getTripById, updateTripProgress } from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createTrip)
    .get(protect, getUserTrips);

router.route('/:id')
    .get(protect, getTripById);

router.route('/:id/progress')
    .put(protect, updateTripProgress);

export default router;
