import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import * as reservationService from '../services/reservation.service';


const Reservations = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [availableTables, setAvailableTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        numberOfGuests: 2,
        specialRequests: ''
    });

    useEffect(() => {
        if (isAuthenticated && currentUser) {
            fetchMyReservations().then();
            fetchTables().then();
        }
    }, [isAuthenticated, currentUser]);

    const fetchMyReservations = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await reservationService.getMyReservations();
            if (response && response.data) {
                setReservations(response.data);
            }
        } catch (err) {
            setError('Failed to fetch reservations');
            console.error('Error fetching reservations:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTables = async () => {
        try {
            const response = await reservationService.getTables();
            if (response && response.data) {
                setTables(response.data);
            }
        } catch (err) {
            console.error('Error fetching tables:', err);
        }
    };

    const fetchAvailableTimes = async (date, guests) => {
        try {
            const response = await reservationService.getAvailableTimes(date, guests);
            if (response && response.data) {
                setAvailableTimes(response.data);
            }
        } catch (err) {
            console.error('Error fetching available times:', err);
            setAvailableTimes([]);
        }
    };

    const fetchAvailableTables = async (date, time, guests) => {
        try {
            const response = await reservationService.getAvailableTables(date, time, guests);
            if (response && response.data) {
                setAvailableTables(response.data);
            }
        } catch (err) {
            console.error('Error fetching available tables:', err);
            setAvailableTables([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Reset selected table when form changes
        setSelectedTable(null);

        if (name === 'date' || name === 'numberOfGuests') {
            const date = name === 'date' ? value : formData.date;
            const guests = name === 'numberOfGuests' ? parseInt(value) : formData.numberOfGuests;

            if (date && guests) {
                fetchAvailableTimes(date, guests);
            }
        }

        // Fetch available tables when all fields are filled
        if (name === 'time' || (name !== 'time' && formData.time)) {
            const date = name === 'date' ? value : formData.date;
            const time = name === 'time' ? value : formData.time;
            const guests = name === 'numberOfGuests' ? parseInt(value) : formData.numberOfGuests;

            if (date && time && guests) {
                fetchAvailableTables(date, time, guests);
            }
        }
    };

    const handleTableSelect = (table) => {
        setSelectedTable(table);
        setShowCreateForm(true);
    };

    const handleCreateReservation = async (e) => {
        e.preventDefault();

        if (!formData.date || !formData.time) {
            setError('Please select both date and time');
            return;
        }

        if (!selectedTable) {
            setError('Please select an available table');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const reservationData = {
                customerId: currentUser.id,
                reservationDate: formData.date,
                reservationTime: formData.time,
                numberOfGuests: parseInt(formData.numberOfGuests),
                specialRequests: formData.specialRequests,
                tableId: selectedTable.id // Include the selected table ID
            };

            const response = await reservationService.createReservation(reservationData);

            if (response && response.success) {
                setShowCreateForm(false);
                setSelectedTable(null);
                setFormData({
                    date: '',
                    time: '',
                    numberOfGuests: 2,
                    specialRequests: ''
                });
                setAvailableTimes([]);
                setAvailableTables([]);
                await fetchMyReservations();
                alert('Reservation created successfully!');
            } else {
                setError(response?.message || 'Failed to create reservation');
            }
        } catch (err) {
            console.error('Error creating reservation:', err);
            setError('Failed to create reservation. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteReservation = async (reservationId) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) {
            return;
        }

        setLoading(true);
        try {
            const response = await reservationService.deleteReservation(reservationId);
            if (response && response.success) {
                await fetchMyReservations();
                alert('Reservation cancelled successfully!');
            } else {
                setError('Failed to cancel reservation');
            }
        } catch (err) {
            console.error('Error cancelling reservation:', err);
            setError('Failed to cancel reservation');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getTableColor = (capacity) => {
        if (capacity <= 2) return 'bg-blue-50 border-blue-200';
        if (capacity <= 4) return 'bg-green-50 border-green-200';
        return 'bg-orange-50 border-orange-200';
    };

    const isTableAvailable = (tableId) => {
        return availableTables.some(table => table.id === tableId);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🍽️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-6">Please login to make table reservations</p>
                </div>
            </div>
        );
    }

    if (loading && !showCreateForm) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your reservations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Table Reservations</h1>
                        <p className="text-gray-600">Book your perfect table for an amazing dining experience</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            {viewMode === 'list' ? (
                                <>
                                    <span>🏢</span> Table View
                                </>
                            ) : (
                                <>
                                    <span>📋</span> List View
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
                        >
                           Make Reservation
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Tables Grid View */}
                {viewMode === 'grid' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Tables</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {tables.map((table) => (
                                <div
                                    key={table.id}
                                    className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                                        isTableAvailable(table.id)
                                            ? 'cursor-pointer hover:scale-105 hover:shadow-lg'
                                            : 'opacity-50 cursor-not-allowed'
                                    } ${getTableColor(table.capacity)}`}
                                    onClick={() => isTableAvailable(table.id) && handleTableSelect(table)}
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-200">
                                            <span className="text-2xl">🍽️</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            Table {table.tableNumber}
                                        </h3>
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
                                            <span>👥</span>
                                            <span>Up to {table.capacity} guests</span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                            isTableAvailable(table.id)
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : 'bg-red-100 text-red-800 border-red-200'
                                        }`}>
                                            {isTableAvailable(table.id) ? 'Available' : 'Unavailable'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                            💡 Tables show real-time availability. Select a table to make a reservation.
                        </p>
                    </div>
                )}

                {/* Create Reservation Form */}
                {showCreateForm && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-100">
                            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Make a Reservation</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Choose your preferred date, time, and table
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setSelectedTable(null);
                                        setError(null);
                                        setFormData({
                                            date: '',
                                            time: '',
                                            numberOfGuests: 2,
                                            specialRequests: ''
                                        });
                                        setAvailableTimes([]);
                                        setAvailableTables([]);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleCreateReservation} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Number of Guests *
                                        </label>
                                        <select
                                            name="numberOfGuests"
                                            value={formData.numberOfGuests}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                                <option key={num} value={num}>
                                                    {num} {num === 1 ? 'Guest' : 'Guests'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Time *
                                        </label>
                                        <select
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        >
                                            <option value="">Select a time slot</option>
                                            {availableTimes.map((time, index) => (
                                                <option key={index} value={time}>
                                                    {formatTime(time)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {formData.date && formData.numberOfGuests && availableTimes.length === 0 && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                        <p className="text-orange-800 flex items-center gap-2">
                                            <span>⚠️</span>
                                            No available times for this date and party size. Please try a different date.
                                        </p>
                                    </div>
                                )}

                                {formData.date && formData.time && formData.numberOfGuests && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            Available Tables for {formatDate(formData.date)} at {formatTime(formData.time)}
                                        </label>

                                        {availableTables.length === 0 ? (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                                <p className="text-red-800">No tables available for the selected time and party size.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {availableTables.map((table) => (
                                                    <div
                                                        key={table.id}
                                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                                                            selectedTable?.id === table.id
                                                                ? 'border-orange-500 bg-orange-50 shadow-md'
                                                                : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                                                        } ${getTableColor(table.capacity)}`}
                                                        onClick={() => handleTableSelect(table)}
                                                    >
                                                        <div className="text-center">
                                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-200">
                                                                <span className="text-lg">🍽️</span>
                                                            </div>
                                                            <h4 className="font-medium text-gray-800">Table {table.tableNumber}</h4>
                                                            <p className="text-sm text-gray-600">Capacity: {table.capacity} guests</p>
                                                            {selectedTable?.id === table.id && (
                                                                <div className="mt-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                                    Selected
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Special Requests
                                    </label>
                                    <textarea
                                        name="specialRequests"
                                        value={formData.specialRequests}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        placeholder="Any special requests, dietary requirements, or occasion details?"
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateForm(false);
                                            setSelectedTable(null);
                                        }}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !selectedTable}
                                        className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Creating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>📅</span>
                                                <span>Book Now</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Reservations List */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Reservations</h2>

                    {reservations.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-medium p-8 text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📅</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No reservations yet</h3>
                            <p className="text-gray-500 mb-6">Book a table to enjoy our amazing dining experience!</p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                            >
                                Make Your First Reservation
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {reservations.map((reservation) => (
                                <div key={reservation.id} className="bg-white rounded-xl shadow-medium p-6 border border-gray-200">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center border border-orange-200">
                                                <span className="text-lg">🍽️</span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    Reservation #{reservation.id}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {formatDate(reservation.reservationDate)} at {formatTime(reservation.reservationTime)}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {reservation.numberOfGuests} {reservation.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(reservation.status)}`}>
                                                {reservation.status}
                                            </span>
                                            {reservation.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleDeleteReservation(reservation.id)}
                                                    className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                                                >
                                                    <span>❌</span>
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {reservation.specialRequests && (
                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <h4 className="font-medium text-gray-800 mb-1 flex items-center gap-2">
                                                <span>💬</span>
                                                Special Requests:
                                            </h4>
                                            <p className="text-gray-600">{reservation.specialRequests}</p>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-sm text-gray-500">
                                        <div>
                                            Created: {formatDate(reservation.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-1">

                                            ID: {reservation.id}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reservations;