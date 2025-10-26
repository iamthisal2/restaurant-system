import React from 'react';
import { useAdmin } from '../../Context/AdminContext';

const Dashboard = () => {
    const { users, foods, ratings, feedbacks, reservations, orders } = useAdmin();

    const stats = [
        {
            title: 'Total Users',
            value: users.length,
            icon: '👥',
            color: 'bg-secondary-500',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Total Foods',
            value: foods.length,
            icon: '🍽️',
            color: 'bg-primary-500',
            change: '+5%',
            changeType: 'positive'
        },
        {
            title: 'Total Ratings',
            value: ratings.length,
            icon: '⭐',
            color: 'bg-accent-500',
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Total Feedbacks',
            value: feedbacks.length,
            icon: '💬',
            color: 'bg-primary-600',
            change: '+3%',
            changeType: 'positive'
        },
        {
            title: 'Active Reservations',
            value: reservations.filter(r => r.status === 'CONFIRMED').length,
            icon: '📅',
            color: 'bg-secondary-600',
            change: '+15%',
            changeType: 'positive'
        },
        {
            title: 'Pending Orders',
            value: orders?.filter(o => o.status === "PENDING").length, // Will be updated when orders are implemented
            icon: '📦',
            color: 'bg-accent-600',
            change: '-2%',
            changeType: 'negative'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-soft border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                <div className="flex items-center mt-2">
                                    <span className={`text-sm font-medium ${
                                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                                </div>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                <span className="text-2xl">{stat.icon}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-white rounded-lg shadow-soft border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                    </div>
                    <div className="p-6">
                        {users.slice(0, 5).map((user, index) => (
                            <div key={user.id || index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-700">
                                            {user.name?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{user.name || 'Unknown User'}</p>
                                        <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {user.enabled ? 'Active' : 'Disabled'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Feedbacks */}
                <div className="bg-white rounded-lg shadow-soft border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Feedbacks</h3>
                    </div>
                    <div className="p-6">
                        {feedbacks.slice(0, 5).map((feedback, index) => (
                            <div key={feedback.id || index} className="py-3 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                            {feedback.content || 'No message'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {feedback.authorName || 'Anonymous'}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-400 ml-2">
                                        {new Date(feedback.createdAt || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-soft border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="text-2xl mb-2">🍽️</div>
                            <p className="text-sm font-medium text-gray-900">Add Food</p>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="text-2xl mb-2">👥</div>
                            <p className="text-sm font-medium text-gray-900">Manage Users</p>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="text-2xl mb-2">📅</div>
                            <p className="text-sm font-medium text-gray-900">View Reservations</p>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="text-2xl mb-2">💬</div>
                            <p className="text-sm font-medium text-gray-900">Review Feedback</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
