import axios from 'axios';

const API_URL = 'http://localhost:5000/api/weather';

export const fetchCurrentWeather = async (city) => {
    try {
        const response = await axios.get(`${API_URL}/current?city=${city}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch weather';
    }
};

export const fetchForecast = async (city) => {
    try {
        const response = await axios.get(`${API_URL}/forecast?city=${city}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch forecast';
    }
};

export const fetchCurrentWeatherByCoords = async (lat, lon) => {
    try {
        const response = await axios.get(`${API_URL}/current?lat=${lat}&lon=${lon}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch weather';
    }
};

export const fetchForecastByCoords = async (lat, lon) => {
    try {
        const response = await axios.get(`${API_URL}/forecast?lat=${lat}&lon=${lon}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch forecast';
    }
};
