import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// @desc    Get current weather
// @route   GET /api/weather/current
// @access  Public
export const getCurrentWeather = async (req, res) => {
    try {
        const { city, lat, lon } = req.query;

        if (!city && (!lat || !lon)) {
            return res.status(400).json({ message: 'Please provide a city name or coordinates' });
        }

        let query = '';
        if (city) {
            query = `q=${city}`;
        } else {
            query = `lat=${lat}&lon=${lon}`;
        }

        const response = await axios.get(`${BASE_URL}/weather?${query}&appid=${API_KEY}&units=metric`);

        res.json(response.data);
    } catch (error) {
        console.error('Weather API Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch weather data', error: error.message });
    }
};

// @desc    Get 5-day forecast
// @route   GET /api/weather/forecast
// @access  Public
export const getForecast = async (req, res) => {
    try {
        const { city, lat, lon } = req.query;

        if (!city && (!lat || !lon)) {
            return res.status(400).json({ message: 'Please provide a city name or coordinates' });
        }

        let query = '';
        if (city) {
            query = `q=${city}`;
        } else {
            query = `lat=${lat}&lon=${lon}`;
        }

        const response = await axios.get(`${BASE_URL}/forecast?${query}&appid=${API_KEY}&units=metric`);

        res.json(response.data);
    } catch (error) {
        console.error('Forecast API Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch forecast data', error: error.message });
    }
};
