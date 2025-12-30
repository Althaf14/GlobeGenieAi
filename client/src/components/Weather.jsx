import React, { useState, useEffect } from 'react';
import { fetchCurrentWeather, fetchForecast } from '../services/weatherService';
import { Cloud, Wind, Droplets, Search, MapPin } from 'lucide-react';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!city.trim()) return;

        setLoading(true);
        setError(null);
        setWeather(null);
        setForecast(null);

        try {
            const weatherData = await fetchCurrentWeather(city);
            setWeather(weatherData);

            const forecastData = await fetchForecast(city);
            // Process forecast to get daily summary (OpenWeather returns 3-hour steps)
            // For simplicity, take one reading per day (e.g., noon) or just show next few slots
            const dailyForecast = forecastData.list.filter(reading => reading.dt_txt.includes("12:00:00")).slice(0, 5);
            setForecast(dailyForecast);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Cloud className="w-6 h-6" /> Weather Explorer
            </h2>

            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <input
                    type="text"
                    placeholder="Enter city name..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    disabled={loading}
                >
                    <Search className="w-4 h-4" /> {loading ? '...' : 'Search'}
                </button>
            </form>

            {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 mb-4 text-center">
                    {error}
                </div>
            )}

            {weather && (
                <div className="animate-fade-in">
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 text-xl text-white font-semibold mb-2">
                            <MapPin className="w-5 h-5" /> {weather.name}, {weather.sys.country}
                        </div>
                        <div className="text-5xl font-bold text-white mb-2">
                            {Math.round(weather.main.temp)}°C
                        </div>
                        <div className="text-blue-200 capitalize text-lg">
                            {weather.weather[0].description}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/10 p-3 rounded-xl flex items-center gap-3">
                            <Droplets className="w-5 h-5 text-blue-300" />
                            <div>
                                <p className="text-xs text-blue-200">Humidity</p>
                                <p className="text-white font-bold">{weather.main.humidity}%</p>
                            </div>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl flex items-center gap-3">
                            <Wind className="w-5 h-5 text-blue-300" />
                            <div>
                                <p className="text-xs text-blue-200">Wind Speed</p>
                                <p className="text-white font-bold">{weather.wind.speed} m/s</p>
                            </div>
                        </div>
                    </div>

                    {forecast && (
                        <div>
                            <h3 className="text-white font-semibold mb-3">5-Day Forecast</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {forecast.map((day) => (
                                    <div key={day.dt} className="bg-white/5 p-2 rounded-lg text-center border border-white/10">
                                        <p className="text-xs text-blue-200 mb-1">
                                            {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </p>
                                        <img
                                            src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`}
                                            alt="icon"
                                            className="w-8 h-8 mx-auto"
                                        />
                                        <p className="text-sm font-bold text-white mt-1">
                                            {Math.round(day.main.temp)}°
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Weather;
