import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MapPin, Bookmark, Send } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PostCard = ({ post, onInteraction }) => {
    const { user } = useAuth();

    // State for interactions
    const [liked, setLiked] = useState(post.likes.includes(user._id));
    const [likeCount, setLikeCount] = useState(post.likes.length);
    const [saved, setSaved] = useState(post.savedBy?.includes(user._id) || false);

    // State for comments
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(post.comments || []);
    const [loadingComment, setLoadingComment] = useState(false);

    const handleLike = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/posts/${post._id}/like`, {}, config);

            if (liked) {
                setLikeCount(prev => prev - 1);
            } else {
                setLikeCount(prev => prev + 1);
            }
            setLiked(!liked);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleSave = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/posts/${post._id}/save`, {}, config);
            setSaved(!saved);
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setLoadingComment(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`http://localhost:5000/api/posts/${post._id}/comment`, { text: commentText }, config);

            setComments(data);
            setCommentText('');
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setLoadingComment(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg border-0 mb-10 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col md:flex-row">
                {/* Image Section - Main Focus */}
                <div className="relative md:w-2/3 h-96 md:h-auto group overflow-hidden">
                    <img
                        src={post.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=60'}
                        alt="Travel Moment"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Overlays for a "Magazine" feel */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 via-transparent to-black/60 opacity-60"></div>

                    <div className="absolute top-4 left-4 flex items-center gap-3 backdrop-blur-md bg-white/10 p-2 rounded-full border border-white/20">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white">
                            {post.user.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium text-sm pr-2">{post.user.name}</span>
                    </div>

                    {post.location && (
                        <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white text-sm font-medium flex items-center gap-2">
                            <MapPin size={14} className="text-yellow-300" />
                            {post.location}
                        </div>
                    )}
                </div>

                {/* Content Side / Bottom */}
                <div className="md:w-1/3 p-6 flex flex-col justify-between bg-gray-50">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Travel Log</h3>
                            <span className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>

                        <p className="text-gray-800 font-serif text-lg leading-relaxed mb-6 italic">
                            "{post.caption}"
                        </p>
                    </div>

                    {/* Actions Bar - Distinct from Insta */}
                    <div className="mt-auto">
                        <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm mb-4">
                            <div className="flex gap-4">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Heart size={20} fill={liked ? "currentColor" : "none"} />
                                    <span className="text-sm font-bold">{likeCount}</span>
                                </button>
                                <button
                                    onClick={() => setShowComments(!showComments)}
                                    className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                                >
                                    <MessageCircle size={20} />
                                    <span className="text-sm font-bold">{comments.length}</span>
                                </button>
                            </div>
                            <button
                                onClick={handleSave}
                                className={`transition-colors ${saved ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Expandable Comments Section */}
                        {showComments && (
                            <div className="bg-white rounded-xl p-4 shadow-inner max-h-60 overflow-y-auto animate-fade-in relative">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Community Thoughts</h4>
                                <div className="space-y-3 mb-4">
                                    {comments.length === 0 ? (
                                        <p className="text-gray-400 text-xs text-center italic">Start the conversation...</p>
                                    ) : (
                                        comments.map((comment, idx) => (
                                            <div key={idx} className="text-sm">
                                                <span className="font-bold text-gray-700 mr-2">{comment.user?.name || 'User'}:</span>
                                                <span className="text-gray-600">{comment.text}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <form onSubmit={handleComment} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="flex-grow bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-300"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={loadingComment}
                                        className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
