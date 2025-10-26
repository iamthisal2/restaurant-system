import React, { useState } from 'react';
import { useAdmin } from '../../Context/AdminContext';

const RatingManagement = () => {
    const { ratings, loading } = useAdmin();
    const [selectedRating, setSelectedRating] = useState(null);
    const [filter, setFilter] = useState('all');

    const filteredRatings = ratings.filter(rating => {
        if (filter === 'all') return true;
        if (filter === 'high') return rating.rating >= 4;
        if (filter === 'low') return rating.rating <= 2;
        return true;
    });

    const getRatingStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'text-green-600';
        if (rating >= 3) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-end items-center">

                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                        Total Ratings: {ratings.length}
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Ratings</option>
                        <option value="high">High Ratings (4-5)</option>
                        <option value="low">Low Ratings (1-2)</option>
                    </select>

                </div>
            </div>

            {/* Rating Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">⭐</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Average Rating</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {ratings?.length > 0
                                    ? (ratings.reduce((sum, r) => sum + r.ratingScore, 0) / ratings.length).toFixed(1)
                                    : '0.0'
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">📊</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Ratings</p>
                            <p className="text-2xl font-bold text-gray-900">{ratings.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">👍</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">High Ratings</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {ratings.filter(r => r.ratingScore >= 4).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">👎</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Low Ratings</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {ratings.filter(r => r.ratingScore <= 2).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ratings Table */}
            <div className="bg-white rounded-lg shadow-soft border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Food Item
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rating
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRatings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="text-4xl mb-4">⭐</div>
                                        <p>No ratings found</p>
                                        <p className="text-sm">Ratings will appear here when customers rate food items.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredRatings.map((rating) => (
                                    <tr key={rating.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {rating.userName?.charAt(0) || 'U'}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {rating.userName || 'Anonymous'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {rating.foodName || 'Unknown Food'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className={`text-lg font-bold ${getRatingColor(rating.ratingScore)}`}>
                                                    {getRatingStars(rating.ratingScore)}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-600">
                                                    ({rating.ratingScore}/5)
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {rating.createdAt ? new Date(rating.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedRating(rating)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rating Details Modal */}
            {selectedRating && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Rating Details</h3>
                            <button
                                onClick={() => setSelectedRating(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">User</label>
                                    <p className="text-sm text-gray-900">{selectedRating.userName || 'Anonymous'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Food Item</label>
                                    <p className="text-sm text-gray-900">{selectedRating.foodName || 'Unknown Food'}</p>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rating</label>
                                <div className="flex items-center">
                                    <span className={`text-2xl font-bold ${getRatingColor(selectedRating.ratingScore)}`}>
                                        {getRatingStars(selectedRating.ratingScore)}
                                    </span>
                                    <span className="ml-3 text-lg text-gray-600">
                                        ({selectedRating.ratingScore}/5)
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <p className="text-sm text-gray-900">
                                    {selectedRating.createdAt ? new Date(selectedRating.createdAt).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RatingManagement;
