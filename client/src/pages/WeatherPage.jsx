import React from 'react';
import Weather from '../components/Weather';

const WeatherPage = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Global Weather</h1>
                <p className="text-gray-600">Check the forecast for your next destination.</p>
            </header>
            <Weather />
        </div>
    );
};

export default WeatherPage;
