import express from 'express';
const router = express.Router();
import { getPlaces, seedPlaces } from '../controllers/placeController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getPlaces);
router.route('/seed').post(seedPlaces); // Open for initial seeding

export default router;
