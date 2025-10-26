import React, { useState, useEffect } from 'react';
import { useAdmin } from '../Context/AdminContext';
import AdminLayout from '../components/AdminLayout';
import Dashboard from '../components/admin/Dashboard';
import UserManagement from '../components/admin/UserManagement';
import FoodManagement from '../components/admin/FoodManagement';
import OrderManagement from '../components/admin/OrderManagement';
import RatingManagement from '../components/admin/RatingManagement';
import FeedbackManagement from '../components/admin/FeedbackManagement';
import ReservationManagement from '../components/admin/ReservationManagement';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { isAdmin, fetchUsers, fetchFoods, fetchRatings, fetchFeedbacks, fetchReservations, fetchOrders } = useAdmin();

    // Track which data has been fetched to avoid refetching
    const [fetchedData, setFetchedData] = useState({
        users: false,
        foods: false,
        ratings: false,
        feedbacks: false,
        reservations: false,
        orders: false
    });

    // Fetch data based on active tab
    useEffect(() => {
        if (!isAdmin) return;

        const fetchDataForTab = async () => {
            switch (activeTab) {
                case 'users':
                    if (!fetchedData.users) {
                        await fetchUsers();
                        setFetchedData(prev => ({ ...prev, users: true }));
                    }
                    break;
                case 'foods':
                    if (!fetchedData.foods) {
                        await fetchFoods();
                        setFetchedData(prev => ({ ...prev, foods: true }));
                    }
                    break;
                case 'ratings':
                    if (!fetchedData.ratings) {
                        await fetchRatings();
                        setFetchedData(prev => ({ ...prev, ratings: true }));
                    }
                    break;
                case 'feedbacks':
                    if (!fetchedData.feedbacks) {
                        await fetchFeedbacks();
                        setFetchedData(prev => ({ ...prev, feedbacks: true }));
                    }
                    break;
                case 'reservations':
                    if (!fetchedData.reservations) {
                        await fetchReservations();
                        setFetchedData(prev => ({ ...prev, reservations: true }));
                    }
                    break;
                case 'orders':
                    if (!fetchedData.orders) {

                        await fetchOrders();
                        setFetchedData(prev => ({ ...prev, orders: true }));
                    }
                    break;
                case 'dashboard':
                    // For dashboard, fetch all data if not already fetched
                    { const promises = [];
                    if (!fetchedData.users) {
                        promises.push(fetchUsers());
                        setFetchedData(prev => ({ ...prev, users: true }));
                    }
                    if (!fetchedData.foods) {
                        promises.push(fetchFoods());
                        setFetchedData(prev => ({ ...prev, foods: true }));
                    }
                    if (!fetchedData.ratings) {
                        promises.push(fetchRatings());
                        setFetchedData(prev => ({ ...prev, ratings: true }));
                    }
                    if (!fetchedData.feedbacks) {
                        promises.push(fetchFeedbacks());
                        setFetchedData(prev => ({ ...prev, feedbacks: true }));
                    }
                    if (!fetchedData.reservations) {
                        promises.push(fetchReservations());
                        setFetchedData(prev => ({ ...prev, reservations: true }));
                    }
                    if (promises.length > 0) {
                        await Promise.all(promises);
                    }
                    break; }
                default:
                    break;
            }
        };

        fetchDataForTab();
    }, [activeTab, isAdmin, fetchUsers, fetchFoods, fetchRatings, fetchFeedbacks, fetchReservations, fetchedData]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const handleRefresh = async () => {
        // Reset fetched data and refetch current tab data
        setFetchedData({
            users: false,
            foods: false,
            ratings: false,
            feedbacks: false,
            reservations: false
        });
        
        // Force refetch by temporarily changing activeTab
        const currentTab = activeTab;
        setActiveTab('refresh');
        setTimeout(() => setActiveTab(currentTab), 100);
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 font-outfit">
                <div className="text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to access the admin panel.</p>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'users':
                return <UserManagement />;
            case 'foods':
                return <FoodManagement />;
            case 'orders':
                return <OrderManagement />;
            case 'ratings':
                return <RatingManagement />;
            case 'feedbacks':
                return <FeedbackManagement />;
            case 'reservations':
                return <ReservationManagement />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <AdminLayout activeTab={activeTab} onTabChange={handleTabChange}>
            <div className="space-y-6">
                {/* Header with Refresh Button */}
                <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activeTab === 'dashboard' ? 'Dashboard' : 
                             activeTab === 'users' ? 'User Management' :
                             activeTab === 'foods' ? 'Food Management' :
                             activeTab === 'orders' ? 'Order Management' :
                             activeTab === 'ratings' ? 'Rating Management' :
                             activeTab === 'feedbacks' ? 'Feedback Management' :
                             activeTab === 'reservations' ? 'Reservation Management' : 'Admin Panel'}
                        </h1>
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 text-sm border border-gray-200 text-gray-800 rounded-md hover:bg-primary-600 transition-colors flex items-center space-x-2"
                            title="Refresh current tab data"
                        >
                            <span>🔄</span>
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                {renderContent()}
            </div>
        </AdminLayout>
    );
};

export default AdminPanel;
