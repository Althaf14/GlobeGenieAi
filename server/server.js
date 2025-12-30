import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import userRoutes from './routes/authRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import finderRoutes from './routes/finderRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import postRoutes from './routes/postRoutes.js';
import tripRoutes from './routes/tripRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/finder', finderRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/trips', tripRoutes);

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('GlobeGenie API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
