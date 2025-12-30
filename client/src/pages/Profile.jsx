import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Mail, Shield, MapPin, Image as ImageIcon, Calendar, DollarSign, LogOut, Navigation } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Profile = () => {
    const { user, logout } = useAuth();
    const [trips, setTrips] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('trips');

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) return;

            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };

                // Fetch Trips
                const tripsRes = await axios.get(`http://localhost:5000/api/trips`, config);
                setTrips(tripsRes.data);

                // Fetch User Posts
                const postsRes = await axios.get(`http://localhost:5000/api/posts/user/${user._id}`, config);
                setPosts(postsRes.data);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data", error);
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user]);

    if (!user) return <LoadingSpinner message="Loading profile..." />;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* User Info Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-24"></div>
                        <div className="px-6 pb-6 text-center">
                            <div className="relative -mt-12 mb-4 inline-block">
                                <div className="bg-white p-2 rounded-full shadow-lg">
                                    <div className="bg-gray-100 rounded-full p-4">
                                        <User size={48} className="text-gray-500" />
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                            <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mt-1 font-medium">
                                <Mail size={14} /> {user.email}
                            </p>

                            <div className="mt-6 space-y-3">
                                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                                    <Shield size={16} /> Verified Traveler
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={logout}
                                    className="w-full bg-red-50 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2"
                                >
                                    <LogOut size={18} /> Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Saved Trips</p>
                                <p className="text-2xl font-bold text-gray-800">{trips.length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                                <ImageIcon size={24} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Community Posts</p>
                                <p className="text-2xl font-bold text-gray-800">{posts.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 border-b border-gray-200 pb-1">
                        <button
                            className={`pb-3 px-2 font-bold text-lg transition border-b-2 ${activeTab === 'trips' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                            onClick={() => setActiveTab('trips')}
                        >
                            My Trips
                        </button>
                        <button
                            className={`pb-3 px-2 font-bold text-lg transition border-b-2 ${activeTab === 'posts' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                            onClick={() => setActiveTab('posts')}
                        >
                            My Posts
                        </button>
                    </div>

                    {/* Content */}
                    <div className="min-h-[300px]">
                        {loading ? <LoadingSpinner message="Loading..." /> : (
                            <>
                                {activeTab === 'trips' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                                        {trips.length > 0 ? trips.map((trip) => (
                                            <Link to={`/trip/${trip._id}`} key={trip._id}>
                                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition h-full flex flex-col justify-between cursor-pointer group">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition">{trip.destination || 'Unnamed Trip'}</h3>
                                                            <span className="bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded text-xs">
                                                                {trip.duration} Days
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 flex items-center mt-1">
                                                            <Calendar size={14} className="mr-1" /> {new Date(trip.createdAt).toLocaleDateString()}
                                                        </p>
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center">
                                                                <DollarSign size={12} className="mr-1" /> {trip.budget} Budget
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-blue-600 font-bold text-sm">
                                                        View Details <Navigation size={14} className="ml-1" />
                                                    </div>
                                                </div>
                                            </Link>
                                        )) : (
                                            <div className="col-span-full text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                                <p className="text-gray-500">No saved trips yet. Start planning!</p>
                                                <Link to="/planner" className="text-blue-600 font-bold mt-2 inline-block hover:underline">Plan a trip</Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'posts' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                                        {posts.length > 0 ? posts.map((post) => (
                                            <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                                                {post.image && (
                                                    <div className="h-40 bg-gray-100 overflow-hidden">
                                                        <img src={post.image} alt={post.caption} className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    <div className="flex items-center text-gray-500 text-xs mb-2">
                                                        <MapPin size={12} className="mr-1" /> {post.location}
                                                    </div>
                                                    <p className="text-gray-800 font-medium line-clamp-2">{post.caption}</p>
                                                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                                        <span>{post.likes.length} Likes</span>
                                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="col-span-full text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                                <p className="text-gray-500">No posts shared yet.</p>
                                                <Link to="/community" className="text-blue-600 font-bold mt-2 inline-block hover:underline">Share your experience</Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
