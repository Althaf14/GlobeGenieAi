import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, DollarSign, MapPin, Activity, Hotel, Sun, CheckCircle, Save, ArrowRight, ArrowLeft, Edit2 } from 'lucide-react';
import Weather from '../components/Weather';
import { fetchCurrentWeather, fetchForecast } from '../services/weatherService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const StartTrip = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [itinerary, setItinerary] = useState(null);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        destination: '',
        days: 3,
        budget: 'Medium',
        interests: [],
        needHotels: false
    });

    const interestOptions = ['Nature', 'Historical', 'Adventure', 'Cultural', 'Food', 'Relaxation'];

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const toggleInterest = (interest) => {
        setFormData(prev => {
            const newInterests = prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest];
            return { ...prev, interests: newInterests };
        });
    };

    // Step 4: Load Weather
    const loadWeather = async () => {
        setLoading(true);
        try {
            const current = await fetchCurrentWeather(formData.destination);
            setWeatherData(current);
            const forecast = await fetchForecast(formData.destination);
            const daily = forecast.list.filter(reading => reading.dt_txt.includes("12:00:00")).slice(0, 5);
            setForecastData(daily);
            handleNext();
        } catch (error) {
            console.error("Weather error", error);
            alert("Could not fetch weather for this destination. Proceeding...");
            handleNext();
        } finally {
            setLoading(false);
        }
    };

    // Step 5: Generate Itinerary
    const generateTrip = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/itinerary/generate', {
                destination: formData.destination,
                days: formData.days,
                budget: formData.budget,
                interests: formData.interests
            });
            setItinerary(data);
            handleNext();
        } catch (error) {
            console.error("Generation error", error);
            alert("Failed to generate itinerary.");
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
                destination: formData.destination,
                duration: formData.days,
                budget: formData.budget,
                itinerary,
                startDate: new Date()
            };

            const { data } = await axios.post('http://localhost:5000/api/trips', tripData, config);
            navigate(`/trip/${data._id}`);
        } catch (err) {
            console.error('Failed to save trip', err);
            const msg = err.response?.data?.message || err.message || 'Unknown error';
            const detail = err.response?.data?.error || '';
            alert(`Failed to save trip: ${msg} ${detail}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-2 text-sm font-medium text-gray-500">
                    <span>Plan</span>
                    <span>Preferences</span>
                    <span>Extras</span>
                    <span>Review</span>
                    <span>Done</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500 ease-out"
                        style={{ width: `${(step / 6) * 100}%` }}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[500px] flex flex-col relative overflow-hidden">

                {/* Step 1: Destination & Basics */}
                {step === 1 && (
                    <div className="animate-fade-in space-y-6">
                        <h2 className="text-3xl font-bold text-gray-800">Where to next?</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Destination City</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={formData.destination}
                                        onChange={(e) => updateFormData('destination', e.target.value)}
                                        placeholder="e.g. Paris, Tokyo, New York"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Duration (Days)</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                        <input
                                            type="number"
                                            min="1" max="14"
                                            value={formData.days}
                                            onChange={(e) => updateFormData('days', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Budget</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                                        <select
                                            value={formData.budget}
                                            onChange={(e) => updateFormData('budget', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                                        >
                                            <option value="Low">Low (Budget)</option>
                                            <option value="Medium">Medium (Balanced)</option>
                                            <option value="High">High (Luxury)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={handleNext}
                                disabled={!formData.destination}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next <ArrowRight className="ml-2" size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Interests */}
                {step === 2 && (
                    <div className="animate-fade-in space-y-6">
                        <h2 className="text-3xl font-bold text-gray-800">What do you enjoy?</h2>
                        <p className="text-gray-500">Selected: {formData.interests.length > 0 ? formData.interests.join(', ') : 'None'}</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {interestOptions.map(interest => (
                                <button
                                    key={interest}
                                    onClick={() => toggleInterest(interest)}
                                    className={`p-4 rounded-xl border-2 transition text-left flex items-center justify-between ${formData.interests.includes(interest)
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-blue-300 text-gray-600'
                                        }`}
                                >
                                    <span className="font-semibold">{interest}</span>
                                    {formData.interests.includes(interest) && <CheckCircle size={20} />}
                                </button>
                            ))}
                        </div>

                        <div className="pt-8 flex justify-between">
                            <button onClick={handleBack} className="text-gray-500 font-semibold hover:text-gray-800">Back</button>
                            <button
                                onClick={handleNext}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700 transition"
                            >
                                Next <ArrowRight className="ml-2" size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Hotels */}
                {step === 3 && (
                    <div className="animate-fade-in space-y-6">
                        <h2 className="text-3xl font-bold text-gray-800">Need a place to stay?</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button
                                onClick={() => { updateFormData('needHotels', true); handleNext(); }}
                                className="p-8 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition group text-left"
                            >
                                <Hotel className="w-12 h-12 text-blue-500 mb-4 group-hover:scale-110 transition" />
                                <h3 className="text-xl font-bold text-gray-800">Yes, find me hotels</h3>
                                <p className="text-gray-500 mt-2">I'll need suggestions for {formData.destination}</p>
                            </button>

                            <button
                                onClick={() => { updateFormData('needHotels', false); loadWeather(); }}
                                className="p-8 border-2 border-gray-200 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition group text-left"
                            >
                                <CheckCircle className="w-12 h-12 text-green-500 mb-4 group-hover:scale-110 transition" />
                                <h3 className="text-xl font-bold text-gray-800">No, I'm all set</h3>
                                <p className="text-gray-500 mt-2">I already have accommodation booked</p>
                            </button>
                        </div>

                        <div className="pt-8 flex justify-start">
                            <button onClick={handleBack} className="text-gray-500 font-semibold hover:text-gray-800">Back</button>
                        </div>
                    </div>
                )}

                {/* Step 4: Weather Preview */}
                {step === 4 && (
                    <div className="animate-fade-in space-y-6 h-full flex flex-col">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Detailed Forecast</h2>
                        <p className="text-gray-600 mb-4">Weather for {formData.destination}</p>

                        {loading && (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                                <p className="text-gray-500">Fetching weather data...</p>
                            </div>
                        )}

                        {!loading && weatherData && (
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-4xl font-bold">{Math.round(weatherData.main.temp)}°C</h3>
                                        <p className="text-blue-100 text-lg capitalize">{weatherData.weather[0].description}</p>
                                    </div>
                                    <Sun className="w-16 h-16 text-yellow-300 animate-pulse" />
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="bg-white/20 rounded-lg p-3 text-center">
                                        <p className="text-xs text-blue-100">Humidity</p>
                                        <p className="font-bold">{weatherData.main.humidity}%</p>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-3 text-center">
                                        <p className="text-xs text-blue-100">Wind</p>
                                        <p className="font-bold">{weatherData.wind.speed} m/s</p>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-3 text-center">
                                        <p className="text-xs text-blue-100">Feels Like</p>
                                        <p className="font-bold">{Math.round(weatherData.main.feels_like)}°</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-8 flex justify-between mt-auto">
                            <button onClick={handleBack} className="text-gray-500 font-semibold hover:text-gray-800">Back</button>
                            <button
                                onClick={generateTrip}
                                disabled={loading}
                                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-green-700 transition shadow-lg"
                            >
                                Generate My Trip <Activity className="ml-2 animate-bounce" size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Itinerary View */}
                {step === 5 && (
                    <div className="animate-fade-in space-y-6 h-full flex flex-col">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold text-gray-800">Your Trip to {formData.destination}</h2>
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
                        </div>

                        {loading && (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mb-4"></div>
                                <p className="text-gray-500">AI is crafting your itinerary...</p>
                            </div>
                        )}

                        {!loading && itinerary && (
                            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                                {itinerary.map((dayPlan, dayIdx) => (
                                    <div key={dayPlan.day} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition bg-gray-50">
                                        <h3 className="font-bold text-blue-800 mb-3 border-b border-gray-200 pb-2">Day {dayPlan.day}</h3>
                                        <div className="space-y-3">
                                            {dayPlan.activities.map((act, actIdx) => (
                                                <div key={actIdx} className="flex items-center text-sm">
                                                    <span className="w-20 font-semibold text-gray-500 flex-shrink-0">{act.time}</span>

                                                    {isEditing ? (
                                                        <div className="flex-1 mr-2">
                                                            <input
                                                                type="text"
                                                                value={act.activity}
                                                                onChange={(e) => handleItineraryChange(dayIdx, actIdx, 'activity', e.target.value)}
                                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-medium"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="flex-1 font-medium text-gray-800">{act.activity}</span>
                                                    )}

                                                    <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-500">{act.type}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-4 flex justify-between mt-auto bg-white border-t border-gray-100">
                            <div className="flex gap-4 w-full justify-end">
                                <button
                                    onClick={handleSaveTrip}
                                    disabled={saving}
                                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-green-700 transition shadow-lg disabled:opacity-50"
                                >
                                    {saving ? <LoadingSpinner size="sm" /> : <Save className="mr-2" size={20} />}
                                    Save Trip & Track Progress
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StartTrip;
