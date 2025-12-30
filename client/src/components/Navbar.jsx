import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Map, Sun, DollarSign, Calendar, MapPin, Users } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) => `
        flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors duration-200
        ${isActive(path)
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
        }
    `;

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text flex items-center gap-2">
                    <Map className="text-blue-600" /> GlobeGenie
                </Link>

                <div className="flex items-center space-x-1 md:space-x-2">
                    {user ? (
                        <>
                            <div className="hidden lg:flex items-center space-x-1 mr-4">
                                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                                    <span>Home</span>
                                </Link>
                                <Link to="/planner" className={navLinkClass('/planner')}>
                                    <Calendar size={18} />
                                    <span>Trip Planner</span>
                                </Link>
                                <Link to="/finder" className={navLinkClass('/finder')}>
                                    <MapPin size={18} />
                                    <span>Hotels & Food</span>
                                </Link>
                                <Link to="/weather" className={navLinkClass('/weather')}>
                                    <Sun size={18} />
                                    <span>Weather</span>
                                </Link>
                                <Link to="/expenses" className={navLinkClass('/expenses')}>
                                    <DollarSign size={18} />
                                    <span>Expenses</span>
                                </Link>
                                <Link to="/community" className={navLinkClass('/community')}>
                                    <Users size={18} />
                                    <span>Community</span>
                                </Link>
                            </div>

                            <div className="h-6 w-px bg-gray-200 mx-2 hidden lg:block"></div>

                            <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                                    {user.name}
                                </span>
                                <Link to="/profile" className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition">
                                    <User size={20} />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link to="/login" className="text-gray-600 font-medium hover:text-blue-600 transition px-3 py-2">
                                Login
                            </Link>
                            <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
