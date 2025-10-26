import React, { useState } from 'react';
import { LayoutDashboard, Users, Hamburger, Package, Star, MessageCircle, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminLayout = ({ children, activeTab, onTabChange }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'users', label: 'User Management', icon: <Users size={20}/> },
        { id: 'foods', label: 'Food Management', icon: <Hamburger size={20}/> },
        { id: 'orders', label: 'Order Management', icon: <Package size={20}/> },
        { id: 'ratings', label: 'Ratings Management', icon: <Star size={20}/> },
        { id: 'feedbacks', label: 'Feedback Management', icon: <MessageCircle size={20}/> },
        { id: 'reservations', label: 'Reservation Management', icon: <CalendarDays size={20}/> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-outfit">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-gray-700">
                    <div>
                        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                        <p className="text-xs text-gray-400 mt-1">Crave Restaurant</p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="mt-8 px-3">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange && onTabChange(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 text-left rounded-xl transition-all duration-200 mb-2 group text-sm ${
                                activeTab === item.id
                                    ? 'bg-orange-500 text-white  transform scale-[1.02]'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            }`}
                        >
                            <div className={`transition-transform duration-200 ${
                                activeTab === item.id ? 'transform scale-110' : 'group-hover:scale-105'
                            }`}>
                                {item.icon}
                            </div>
                            <span className="font-medium tracking-wide">{item.label}</span>
                            {activeTab === item.id && (
                                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            )}
                        </button>
                    ))}
                </nav>


            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'lg:ml-64' : 'ml-0'
            }`}>

                {/* Content Area */}
                <main className="p-6 min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>


        </div>
    );
};

export default AdminLayout;