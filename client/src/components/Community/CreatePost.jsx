import React, { useState } from 'react';
import { Camera, MapPin, Send, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

const CreatePost = ({ onPostCreated }) => {
    const { user } = useAuth();
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!caption) return;

        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            await axios.post('http://localhost:5000/api/posts', {
                caption,
                location,
                image: imageUrl
            }, config);

            setCaption('');
            setLocation('');
            setImageUrl('');
            setIsExpanded(false);
            if (onPostCreated) onPostCreated();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isExpanded) {
        return (
            <div
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 cursor-pointer hover:shadow-md transition flex items-center gap-3"
                onClick={() => setIsExpanded(true)}
            >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                    {user.name.charAt(0)}
                </div>
                <p className="text-gray-500 flex-grow">Share your latest adventure...</p>
                <Camera className="text-blue-500" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6 animate-fade-in relative z-10">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50">
                <h3 className="font-bold text-gray-700">Create New Post</h3>
                <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Share your travel experience..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none h-24 mb-3"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                        <MapPin size={18} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Add Location"
                            className="w-full outline-none text-sm"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                        <Camera size={18} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Image URL (http://...)"
                            className="w-full outline-none text-sm"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </div>
                </div>

                {imageUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden h-48 bg-gray-50">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || !caption}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Posting...' : <><Send size={16} /> Post</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
