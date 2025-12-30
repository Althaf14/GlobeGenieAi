import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/Community/CreatePost';
import PostCard from '../components/Community/PostCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import { TrendingUp, Users, Award } from 'lucide-react';

const Community = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPosts = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('http://localhost:5000/api/posts', config);
            setPosts(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to load feed');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchPosts();
    }, [user]);

    const handlePostCreated = () => {
        fetchPosts();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-2">
                    <CreatePost onPostCreated={handlePostCreated} />

                    <ErrorMessage message={error} />

                    {loading ? (
                        <LoadingSpinner message="Loading community feed..." />
                    ) : (
                        <div className="space-y-6">
                            {posts.length === 0 ? (
                                <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
                                    <p className="text-gray-500">No posts yet. Be the first to share!</p>
                                </div>
                            ) : (
                                posts.map(post => (
                                    <PostCard key={post._id} post={post} />
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <TrendingUp className="text-blue-500" size={20} /> Trending
                        </h3>
                        <div className="space-y-3">
                            {['#TravelGoals', '#HiddenGems', '#FoodieAdventures', '#SoloTravel'].map(tag => (
                                <p key={tag} className="text-gray-600 text-sm hover:text-blue-600 cursor-pointer font-medium">
                                    {tag}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <Award className="w-8 h-8 text-yellow-300" />
                            <h3 className="font-bold text-lg">Top Travelers</h3>
                        </div>
                        <p className="text-blue-100 text-sm mb-4">
                            Connect with top explorers and get inspired for your next trip!
                        </p>
                        <button className="w-full bg-white/20 hover:bg-white/30 transition py-2 rounded-lg font-bold text-sm">
                            View Leaderboard
                        </button>
                    </div>

                    <footer className="text-xs text-gray-400 text-center">
                        © 2024 GlobeGenie AI Community
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Community;
