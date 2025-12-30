import Place from '../models/Place.js';

// @desc    Fetch all places
// @route   GET /api/places
// @access  Private
const getPlaces = async (req, res) => {
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const category = req.query.category
        ? {
            category: req.query.category,
        }
        : {};

    const places = await Place.find({ ...keyword, ...category });
    res.json(places);
};

// @desc    Seed places (Temporary)
// @route   POST /api/places/seed
// @access  Public
const seedPlaces = async (req, res) => {
    const samplePlaces = [
        {
            name: 'Taj Mahal',
            description: 'Ivory-white marble mausoleum on the right bank of the river Yamuna in Agra.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg',
            category: 'Historical',
            location: 'Agra, India',
        },
        {
            name: 'Eiffel Tower',
            description: 'Wrought-iron lattice tower on the Champ de Mars in Paris, France.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg',
            category: 'Historical',
            location: 'Paris, France',
        },
        {
            name: 'Grand Canyon',
            description: 'Steep-sided canyon carved by the Colorado River in Arizona, United States.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Dawn_on_the_Grand_Canyon_%282635445214%29.jpg/800px-Dawn_on_the_Grand_Canyon_%282635445214%29.jpg',
            category: 'Nature',
            location: 'Arizona, USA',
        },
        {
            name: 'Kyoto',
            description: 'Famous for its classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kinkaku-ji_2013.jpg/800px-Kinkaku-ji_2013.jpg',
            category: 'Cultural',
            location: 'Kyoto, Japan',
        },
        {
            name: 'Machu Picchu',
            description: 'Incan citadel set high in the Andes Mountains in Peru.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/800px-Machu_Picchu%2C_Peru.jpg',
            category: 'Adventure',
            location: 'Cusco Region, Peru',
        },
        {
            name: 'Santorini',
            description: 'One of the Cyclades islands in the Aegean Sea.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Oia_Santorini_Greece.jpg/800px-Oia_Santorini_Greece.jpg',
            category: 'Nature',
            location: 'Santorini, Greece',
        },
    ];

    try {
        await Place.deleteMany(); // Clear existing
        const createdPlaces = await Place.insertMany(samplePlaces);
        res.status(201).json(createdPlaces);
    } catch (error) {
        res.status(400).json({ message: 'Seed failed: ' + error.message });
    }
};

export { getPlaces, seedPlaces };
