import Trip from '../models/Trip.js';

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
    try {
        const { destination, duration, budget, itinerary, totalCost, startDate } = req.body;

        const trip = new Trip({
            userId: req.user._id,
            destination,
            duration,
            budget,
            itinerary,
            totalCost,
            startDate
        });

        const createdTrip = await trip.save();
        res.status(201).json(createdTrip);
    } catch (error) {
        console.error('Error creating trip:', error);
        import('fs').then(fs => {
            fs.writeFileSync('error_log.txt', `Error: ${error.message}\nStack: ${error.stack}\nBody: ${JSON.stringify(req.body)}\n`);
        });
        res.status(400).json({ message: 'Invalid trip data', error: error.message });
    }
};

// @desc    Get user trips
// @route   GET /api/trips
// @access  Private
const getUserTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get trip by ID
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (trip) {
            // Ensure user owns this trip
            if (trip.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            res.json(trip);
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update trip progress (toggle visited)
// @route   PUT /api/trips/:id/progress
// @access  Private
const updateTripProgress = async (req, res) => {
    try {
        const { dayIndex, activityIndex, visited } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (trip) {
            if (trip.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            // Verify indices exist
            if (trip.itinerary[dayIndex] && trip.itinerary[dayIndex].activities[activityIndex]) {
                trip.itinerary[dayIndex].activities[activityIndex].visited = visited;
                const updatedTrip = await trip.save();
                res.json(updatedTrip);
            } else {
                res.status(400).json({ message: 'Invalid activity index' });
            }
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export { createTrip, getUserTrips, getTripById, updateTripProgress };
