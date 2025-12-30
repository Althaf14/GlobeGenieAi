import express from 'express';
import { generateItinerary } from '../controllers/itineraryController.js';
// import { protect } from '../middleware/authMiddleware.js'; // Optional: if we want to protect it later

const router = express.Router();

router.post('/generate', generateItinerary);

export default router;
