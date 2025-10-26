import React, { useState, useEffect } from 'react';
import { useAdmin } from '../Context/AdminContext';
import AdminLayout from '../components/AdminLayout';
import Dashboard from '../components/admin/Dashboard';
import FeedbackManagement from '../components/admin/FeedbackManagement';
import ReservationManagement from '../components/admin/ReservationManagement';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { isAdmin, fetchFeedbacks, fetchReservations, } = useAdmin();

    // Track which data has been fetched to avoid refetching
    const [fetchedData, setFetchedData] = useState({
        
        feedbacks: false,
        reservations: false,
        
    });

    // Fetch data based on active tab
    useEffect(() => {
        if (!isAdmin) return;

        const fetchDataForTab = async () => {
            switch (activeTab) {
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
               
                case 'dashboard':
                    // For dashboard, fetch all data if not already fetched
                    { const promises = [];
                    
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
    }, [activeTab, isAdmin, fetchFeedbacks, fetchReservations, fetchedData]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const handleRefresh = async () => {
        // Reset fetched data and refetch current tab data
        setFetchedData({
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
