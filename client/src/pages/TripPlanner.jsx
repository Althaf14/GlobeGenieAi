import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Weather from '../components/Weather';
import { Calendar, DollarSign, MapPin, Clock, Star, Activity, Edit2, Save, Check } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const TripPlanner = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Form States
    const [destination, setDestination] = useState('');
    const [days, setDays] = useState(3);
    const [budget, setBudget] = useState('Medium');
    const [interests, setInterests] = useState([]);

    // UI States
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const interestOptions = ['Nature', 'Historical', 'Adventure', 'Cultural'];

    const handleInterestChange = (interest) => {
        setInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setItinerary(null);
        setIsEditing(false);

        try {
            const { data } = await axios.post('http://localhost:5000/api/itinerary/generate', {
                destination,
                days,
                budget,
                interests
            });
            setItinerary(data);
        } catch (err) {
            setError('Failed to generate itinerary. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleItineraryChange = (dayIndex, activityIndex, field, value) => {
        const newItinerary = [...itinerary];
        newItinerary[dayIndex].activities[activityIndex][field] = value;
        setItinerary(newItinerary);
    };

    const handleSaveTrip = async () => {
        setSaving(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            const tripData = {
                destination,
                duration: days,
                budget,
                itinerary,
                startDate: new Date()
            };

            const { data } = await axios.post('http://localhost:5000/api/trips', tripData, config);
            navigate(`/trip/${data._id}`);
        } catch (err) {
            setError('Failed to save trip. Please try again.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">AI Trip Planner</h1>
                <p className="text-lg text-gray-600">Design your perfect journey in seconds.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                        <h2 className="text-xl font-semibold mb-6 flex items-center text-blue-600">
                            <Activity className="mr-2" size={24} /> Trip Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                    <MapPin className="mr-2 text-gray-400" size={18} /> Destination
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Paris, Tokyo, New York"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                    <Calendar className="mr-2 text-gray-400" size={18} /> Duration (Days)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="14"
                                    value={days}
                                    onChange={(e) => setDays(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                    <DollarSign className="mr-2 text-gray-400" size={18} /> Budget Level
                                </label>
                                <select
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                >
                                    <option value="Low">Low - Budget Friendly</option>
                                    <option value="Medium">Medium - Balanced</option>
                                    <option value="High">High - Luxury</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-3 flex items-center">
                                    <Star className="mr-2 text-gray-400" size={18} /> Interests
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {interestOptions.map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => handleInterestChange(option)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition border ${interests.includes(option)
                                                ? 'bg-blue-100 border-blue-500 text-blue-700'
                                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Generating Plan...' : 'Generate Itinerary'}
                            </button>
                        </form>
                    </div>

                    {/* Weather Widget */}
                    <div className="mt-8 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl shadow-lg p-1">
                        <Weather />
                    </div>
                </div>

                {/* Results Display */}
                <div className="lg:col-span-2 space-y-6">
                    <ErrorMessage message={error} />

                    {!itinerary && !loading && !error && (
                        <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-12 text-center text-gray-400">
                            <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Set your preferences and click generate to see your plan here.</p>
                        </div>
                    )}

                    {loading && <LoadingSpinner message="Creating your perfect itinerary..." />}

                    {itinerary && (
                        <div className="space-y-6 animate-fade-in-up">
                            {/* Actions Bar */}
                            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800">Your Itinerary</h3>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition ${isEditing
                                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Edit2 size={16} className="mr-2" />
                                        {isEditing ? 'Stop Editing' : 'Edit Plan'}
                                    </button>
                                    <button
                                        onClick={handleSaveTrip}
                                        disabled={saving}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition shadow-sm disabled:opacity-50"
                                    >
                                        {saving ? <LoadingSpinner size="sm" /> : <Save size={16} className="mr-2" />}
                                        Save Trip
                                    </button>
                                </div>
                            </div>

                            {itinerary.map((dayPlan, dayIdx) => (
                                <div key={dayPlan.day} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                                    <div className="bg-blue-50 px-6 py-3 border-b border-blue-100">
                                        <h3 className="text-lg font-bold text-blue-800">Day {dayPlan.day}</h3>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {dayPlan.activities.map((activity, actIdx) => (
                                            <div key={actIdx} className="p-6 flex items-start hover:bg-gray-50 transition">
                                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4 flex-shrink-0">
                                                    {activity.time === 'Morning' && <span className="text-xl">☀️</span>}
                                                    {activity.time === 'Afternoon' && <span className="text-xl">🌤️</span>}
                                                    {activity.time === 'Evening' && <span className="text-xl">🌙</span>}
                                                </div>
                                                <div className="w-full">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-1 block">
                                                        {activity.time} Activity
                                                    </span>

                                                    {isEditing ? (
                                                        <div className="space-y-2 mb-2">
                                                            <input
                                                                type="text"
                                                                value={activity.activity}
                                                                onChange={(e) => handleItineraryChange(dayIdx, actIdx, 'activity', e.target.value)}
                                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-lg font-bold"
                                                                placeholder="Activity Name"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <h4 className="text-lg font-bold text-gray-800 mb-1">{activity.activity}</h4>
                                                    )}

                                                    <div className="flex space-x-3 text-sm text-gray-500">
                                                        <span className="flex items-center">
                                                            <Activity size={14} className="mr-1" /> {activity.type}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <DollarSign size={14} className="mr-1" /> {activity.cost} Cost
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default TripPlanner;
