import express from 'express';
import { findPlaces } from '../controllers/finderController.js';

const router = express.Router();

router.get('/search', findPlaces);

export default router;
