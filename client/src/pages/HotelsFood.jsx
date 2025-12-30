import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Coffee, Home, Star, DollarSign } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const HotelsFood = () => {
    const [destination, setDestination] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'hotel', 'restaurant'
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!destination.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/finder/search?destination=${destination}&type=${filter}`);
            setResults(data);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch recommendations. Please try again.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Stay & Eats</h1>
                <p className="text-gray-600">Discover the best hotels and restaurants around the globe.</p>
            </header>

            {/* Search Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-10 max-w-3xl mx-auto">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Where are you going? (e.g., Dubai, Paris)"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            type="button"
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2 rounded-full font-medium transition ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('hotel')}
                            className={`flex items-center px-6 py-2 rounded-full font-medium transition ${filter === 'hotel' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                        >
                            <Home size={18} className="mr-2" /> Hotels
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('restaurant')}
                            className={`flex items-center px-6 py-2 rounded-full font-medium transition ${filter === 'restaurant' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                }`}
                        >
                            <Coffee size={18} className="mr-2" /> Restaurants
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={!destination.trim() || loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Searching...' : 'Search Places'}
                    </button>
                </form>
            </div>

            {/* Results Grid */}
            <ErrorMessage message={error} />

            {loading && <LoadingSpinner message="Finding the best spots..." />}

            {searched && !loading && !error && results.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-500">No results found for "{destination}". Try general terms.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((place, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 group">
                        <div className={`h-3 w-full ${place.type === 'hotel' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${place.type === 'hotel' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {place.type}
                                </span>
                                <div className="flex items-center text-yellow-500">
                                    <Star size={16} fill="currentColor" />
                                    <span className="ml-1 text-sm font-semibold text-gray-700">{place.rating}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition">{place.name}</h3>
                            <p className="text-gray-500 text-sm flex items-center mb-4">
                                <MapPin size={14} className="mr-1" /> {place.location}
                            </p>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <span className="text-gray-600 font-medium flex items-center">
                                    Price: <span className="text-gray-900 ml-1">{place.priceRange}</span>
                                </span>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                                    View Details
                                </button>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center ml-4"
                                >
                                    <MapPin size={14} className="mr-1" /> Map
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default HotelsFood;
