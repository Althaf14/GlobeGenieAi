import axios from 'axios';

const findPlaces = async (req, res) => {
    const { destination, type } = req.query;

    if (!destination) {
        res.status(400).json({ message: 'Please provide a destination' });
        return;
    }

    try {
        // Step 1: Geocode the destination using Nominatim
        console.log(`Geocoding destination: ${destination}`);
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`;

        // Nominatim requires a User-Agent
        const headers = {
            'User-Agent': 'GlobeGenieAI/1.0'
        };

        const geoRes = await axios.get(nominatimUrl, { headers });

        if (!geoRes.data || geoRes.data.length === 0) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        const { lat, lon, display_name } = geoRes.data[0];
        console.log(`Found location: ${display_name} (${lat}, ${lon})`);

        // Step 2: Search for places using Overpass API
        // Queries for hotels and restaurants around the coordinates (radius 5000m approx)
        let queryType = '';
        if (type === 'hotel') {
            queryType = `node["tourism"="hotel"]`;
        } else if (type === 'restaurant') {
            queryType = `node["amenity"="restaurant"]`;
        }

        let queryBody = '';
        if (queryType) {
            queryBody = `${queryType}(around:3000, ${lat}, ${lon});`;
        } else {
            // Both
            queryBody = `
              (
                node["tourism"="hotel"](around:3000, ${lat}, ${lon});
                node["amenity"="restaurant"](around:3000, ${lat}, ${lon});
              );
             `;
        }

        // Overpass QL query: Search within 3000m radius
        const overpassQuery = `
            [out:json];
            ${queryBody}
            out body 20;
        `;

        const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

        console.log('Fetching places from Overpass API...');
        const placesRes = await axios.get(overpassUrl);
        const elements = placesRes.data.elements;

        // Step 3: Map results to specific format
        const results = elements.map(place => {
            const isHotel = place.tags.tourism === 'hotel';

            // Infer price/rating randomly for demo purposes as OSM doesn't have this usually
            // In a real app, you might cross-reference this or just leave it blank
            const randomRating = (3 + Math.random() * 2).toFixed(1);
            const priceLevel = isHotel ? ['$', '$$', '$$$', '$$$$'][Math.floor(Math.random() * 4)] : ['$', '$$', '$$$'][Math.floor(Math.random() * 3)];

            return {
                name: place.tags.name || (isHotel ? 'Unnamed Hotel' : 'Unnamed Restaurant'),
                type: isHotel ? 'hotel' : 'restaurant',
                rating: randomRating, // Mocked details
                priceRange: priceLevel, // Mocked details
                location: place.tags['addr:street'] ? `${place.tags['addr:street']}, ${destination}` : `${destination} Area`,
                lat: place.lat,
                lon: place.lon,
                osmId: place.id
            };
        }).filter(item => item.name !== 'Unnamed Hotel' && item.name !== 'Unnamed Restaurant'); // Filter out unnamed places

        console.log(`Found ${results.length} places.`);
        res.json(results);

    } catch (error) {
        console.error('Error in findPlaces:', error.message);
        import('fs').then(fs => {
            fs.writeFileSync('finder_error_log.txt', `Error: ${error.message}\nStack: ${error.stack}\n`);
        });
        res.status(500).json({ message: 'Failed to fetch recommendations', error: error.message });
    }
};

export { findPlaces };
