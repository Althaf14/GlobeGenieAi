import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import { MapPin, Calendar, DollarSign, CheckCircle, Circle, Clock } from 'lucide-react';

const TripDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get(`http://localhost:5000/api/trips/${id}`, config);
                setTrip(data);
            } catch (err) {
                setError('Failed to load trip details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchTrip();
    }, [id, user]);

    const handleToggleVisited = async (dayIndex, activityIndex) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            const updatedVisitedStatus = !trip.itinerary[dayIndex].activities[activityIndex].visited;

            // Optimistic update
            const newTrip = { ...trip };
            newTrip.itinerary[dayIndex].activities[activityIndex].visited = updatedVisitedStatus;
            setTrip(newTrip);

            await axios.put(
                `http://localhost:5000/api/trips/${id}/progress`,
                { dayIndex, activityIndex, visited: updatedVisitedStatus },
                config
            );
        } catch (err) {
            console.error('Failed to update progress', err);
            // Revert on error (optional, could add toast)
        }
    };

    if (loading) return <LoadingSpinner message="Loading trip details..." />;
    if (error) return <ErrorMessage message={error} />;
    if (!trip) return <ErrorMessage message="Trip not found" />;

    // Calculate Progress
    const totalActivities = trip.itinerary.reduce((acc, day) => acc + day.activities.length, 0);
    const visitedActivities = trip.itinerary.reduce((acc, day) =>
        acc + day.activities.filter(a => a.visited).length, 0
    );
    const progressPercentage = totalActivities === 0 ? 0 : Math.round((visitedActivities / totalActivities) * 100);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 md:h-48 relative">
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">{trip.destination || 'Your Trip'}</h1>
                        <div className="flex items-center gap-4 text-sm md:text-base opacity-90">
                            <span className="flex items-center"><Calendar size={16} className="mr-1" /> {trip.duration} Days</span>
                            <span className="flex items-center"><DollarSign size={16} className="mr-1" /> {trip.budget} Budget</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar Section */}
                <div className="p-6 md:p-8 border-b border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                        <h2 className="text-xl font-bold text-gray-800">Trip Progress</h2>
                        <span className="text-2xl font-bold text-blue-600">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-blue-600 h-4 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                        {visitedActivities} of {totalActivities} places visited
                    </p>
                </div>
            </div>

            {/* Itinerary */}
            <div className="space-y-6">
                {trip.itinerary.map((dayPlan, dayIdx) => (
                    <div key={dayIdx} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">Day {dayPlan.day}</h3>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                                {dayPlan.activities.filter(a => a.visited).length}/{dayPlan.activities.length} Done
                            </span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {dayPlan.activities.map((activity, actIdx) => (
                                <div
                                    key={actIdx}
                                    className={`p-5 flex items-center transition group ${activity.visited ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                                >
                                    <button
                                        onClick={() => handleToggleVisited(dayIdx, actIdx)}
                                        className={`mr-5 flex-shrink-0 transition-transform active:scale-90 focus:outline-none`}
                                    >
                                        {activity.visited ? (
                                            <CheckCircle size={28} className="text-green-500 fill-green-100" />
                                        ) : (
                                            <Circle size={28} className="text-gray-300 group-hover:text-blue-400" />
                                        )}
                                    </button>

                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs font-bold uppercase tracking-wider ${activity.visited ? 'text-green-600' : 'text-blue-500'}`}>
                                                {activity.time}
                                            </span>
                                            <span className="text-xs text-gray-400 flex items-center">
                                                <Clock size={12} className="mr-1" /> Estimated
                                            </span>
                                        </div>
                                        <h4 className={`text-lg font-bold mb-1 transition ${activity.visited ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                            {activity.activity}
                                        </h4>
                                        <div className="flex gap-3 text-sm text-gray-500">
                                            <span>{activity.type}</span>
                                            <span>•</span>
                                            <span>{activity.cost}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TripDetails;
