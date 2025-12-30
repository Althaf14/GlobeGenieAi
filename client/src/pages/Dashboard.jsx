import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PlaceCard from '../components/PlaceCard';

import LoadingSpinner from '../components/UI/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Auth context for token - generally axios interceptor handles this, 
    // but ensuring headers if needed.
    const { user } = useContext(AuthContext);

    // Categories list - can also be dynamic in future
    const categories = ['All', 'Nature', 'Historical', 'Adventure', 'Cultural'];

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                // Construct query parameters
                let query = '?';
                if (searchTerm) query += `keyword=${searchTerm}&`;
                if (selectedCategory !== 'All') query += `category=${selectedCategory}`;

                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.get(`http://localhost:5000/api/places${query}`, config);
                setPlaces(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching places:", error);
                setLoading(false);
            }
        };

        // Debounce search slightly to avoid too many requests
        const timeoutId = setTimeout(() => {
            fetchPlaces();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedCategory, user.token]);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user.name}!</h1>
                    <p className="text-gray-600">Where would you like to go today?</p>
                </div>
                <a
                    href="/start-trip"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md flex items-center"
                >
                    <span className="mr-2">✈️</span> Start a New Trip
                </a>
            </header>

            {/* Weather Widget Removed as per requirements */}

            {/* Search and Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">

                {/* Search Bar */}
                <div className="w-full md:w-1/2 relative">
                    <input
                        type="text"
                        placeholder="Search places..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <LoadingSpinner message="Searching for amazing places..." />
            ) : places.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-600">No places found matching your criteria.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                        className="mt-4 text-blue-500 hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {places.map((place) => (
                        <PlaceCard key={place._id} place={place} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
