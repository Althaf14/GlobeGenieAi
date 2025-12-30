import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Plus, History, TrendingUp, PieChart } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const ExpenseTracker = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        travelCost: '',
        hotelCost: '',
        foodCost: '',
        activityCost: '',
        description: location.state?.trip ? `Trip to ${location.state.trip.destination}` : ''
    });
    const [error, setError] = useState('');
    const [totalSpent, setTotalSpent] = useState(0);

    // Fetch expenses
    const fetchExpenses = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get(`http://localhost:5000/api/expenses/${user._id}`, config);
            setExpenses(data);

            // Calculate total
            const total = data.reduce((acc, curr) => acc + curr.totalCost, 0);
            setTotalSpent(total);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch expenses');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchExpenses();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            await axios.post('http://localhost:5000/api/expenses', formData, config);

            // Reset form and refresh list
            setFormData({
                travelCost: '',
                hotelCost: '',
                foodCost: '',
                activityCost: '',
                description: ''
            });
            fetchExpenses();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save expense');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <DollarSign className="w-8 h-8 text-green-600" /> Expense Tracker
                </h1>
                <p className="text-gray-600">Track your travel budget efficiently.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Expense Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 flex items-center text-green-700">
                            <Plus className="w-5 h-5 mr-2" /> Add New Expense
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="e.g. Dinner at Paris"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Travel ($)</label>
                                    <input
                                        type="number"
                                        name="travelCost"
                                        value={formData.travelCost}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel ($)</label>
                                    <input
                                        type="number"
                                        name="hotelCost"
                                        value={formData.hotelCost}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Food ($)</label>
                                    <input
                                        type="number"
                                        name="foodCost"
                                        value={formData.foodCost}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity ($)</label>
                                    <input
                                        type="number"
                                        name="activityCost"
                                        value={formData.activityCost}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <ErrorMessage message={error} />

                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition"
                            >
                                Save Expense
                            </button>
                        </form>
                    </div>
                </div>

                {/* Summary & History */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Summary Card */}
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl shadow-lg p-6 text-white flex items-center justify-between">
                        <div>
                            <p className="text-green-100 mb-1 font-medium">Total Spent</p>
                            <h2 className="text-4xl font-bold">${totalSpent.toLocaleString()}</h2>
                        </div>
                        <div className="bg-white/20 p-4 rounded-lg">
                            <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* History */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                            <History className="w-5 h-5 text-gray-500" />
                            <h3 className="text-lg font-bold text-gray-800">Expense History</h3>
                        </div>

                        <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                            {loading ? (
                                <LoadingSpinner message="Loading expenses..." />
                            ) : expenses.length === 0 ? (
                                <p className="p-6 text-center text-gray-500">No expenses recorded yet.</p>
                            ) : (
                                expenses.map((expense) => (
                                    <div key={expense._id} className="p-6 hover:bg-gray-50 transition flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-gray-800 mb-1">
                                                {expense.description || 'General Expense'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(expense.createdAt).toLocaleDateString()} at {new Date(expense.createdAt).toLocaleTimeString()}
                                            </p>
                                            <div className="flex gap-3 mt-2 text-xs">
                                                {expense.travelCost > 0 && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Travel: ${expense.travelCost}</span>}
                                                {expense.hotelCost > 0 && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Hotel: ${expense.hotelCost}</span>}
                                                {expense.foodCost > 0 && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Food: ${expense.foodCost}</span>}
                                                {expense.activityCost > 0 && <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded">Activity: ${expense.activityCost}</span>}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-lg font-bold text-green-600">
                                                +${expense.totalCost}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;
