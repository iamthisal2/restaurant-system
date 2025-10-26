import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import * as orderService from '../services/order.service';
import { assets } from '../assets/assets';

const MyOrders = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isAuthenticated && currentUser) {
            fetchMyOrders().then();
        }
    }, [isAuthenticated, currentUser]);

    const fetchMyOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await orderService.getUserOrders(currentUser.id);
            if (response && response.data) {
                setOrders(response.data);
            }
        } catch (err) {
            setError('Failed to fetch orders');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'DELIVERING':
                return 'bg-blue-100 text-blue-800';
            case 'PREPARING':
                return 'bg-orange-100 text-orange-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-medium text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-6">Please login to view your orders</p>
                    <a
                        href="/login"
                        className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                    >
                        Login
                    </a>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-medium text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchMyOrders}
                        className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track your order history</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-medium p-8 text-center">
                        <img
                            src={assets.basket_icon}
                            alt="No orders"
                            className="w-24 h-24 mx-auto mb-4 opacity-50"
                        />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Start ordering some delicious food!</p>
                        <a
                            href="/"
                            className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                        >
                            Browse Menu
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-medium p-6 border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Order #{order.id}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {formatDate(order.orderDateTime)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <p className="text-lg font-bold text-primary-500 mt-1">
                                            Rs {order.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-800 mb-2">Delivery Address:</h4>
                                    <p className="text-gray-600">{order.deliveryAddress}</p>
                                    {order.contactNumber && (
                                        <p className="text-gray-600">Phone: {order.contactNumber}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-800 mb-2">Order Items:</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={'/default/default-food.jpg'}
                                                        alt={item.foodName}
                                                        className="w-10 h-10 object-cover rounded-lg"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-800">{item.foodName}</p>
                                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-gray-800">
                                                    Rs {(item.priceAtPurchase * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {order.specialInstructions && (
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-800 mb-1">Special Instructions:</h4>
                                        <p className="text-gray-600">{order.specialInstructions}</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="text-sm text-gray-600">
                                        Payment: Online
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
