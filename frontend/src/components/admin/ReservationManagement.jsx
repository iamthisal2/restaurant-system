import React, { useState } from 'react';
import { useAdmin } from '../../Context/AdminContext';
import {formatDate, formatDateTime, formatTime} from "../../utils/time.utils.js";
import CreateReservation from './CreateReservation';
import { showErrorToast } from '../../utils/toast.utils';

const ReservationManagement = () => {
    const { reservations, loading, updateReservationStatus, deleteReservation, fetchReservations } = useAdmin();
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const filteredReservations = reservations.filter(reservation => {
        if (statusFilter === 'all') return true;
        return reservation.status === statusFilter;
    });

    const handleStatusUpdate = async (reservationId, newStatus) => {
        setUpdatingStatus(reservationId);
        try {
            await updateReservationStatus(reservationId, newStatus);
        } catch (error) {
            console.error('Error updating reservation status:', error);
            showErrorToast('Failed to update reservation status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleDelete = async (reservationId) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            try {
                await deleteReservation(reservationId);
            } catch (error) {
                console.error('Error deleting reservation:', error);
                showErrorToast('Failed to delete reservation');
            }
        }
    };

    const handleCreateSuccess = async () => {
        setShowCreateForm(false);
        await fetchReservations(); // Refresh the reservations list
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusCounts = () => {
        return {
            total: reservations.length,
            pending: reservations.filter(r => r.status === 'PENDING').length,
            confirmed: reservations.filter(r => r.status === 'CONFIRMED').length,
            cancelled: reservations.filter(r => r.status === 'CANCELLED').length,
            completed: reservations.filter(r => r.status === 'COMPLETED').length,
        };
    };


    const statusCounts = getStatusCounts();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-end items-center">


                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create Reservation</span>
                    </button>


                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="all">All Reservations</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
            </div>

            {/* Status Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">📅</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">⏳</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">✅</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Confirmed</p>
                            <p className="text-2xl font-bold text-green-600">{statusCounts.confirmed}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">❌</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Cancelled</p>
                            <p className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">🎉</div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-blue-600">{statusCounts.completed}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reservations Table */}
            <div className="bg-white rounded-lg shadow-soft border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Guests / Table
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                                    <p>Loading reservations...</p>
                                </td>
                            </tr>
                        ) : filteredReservations.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                    <div className="text-4xl mb-4">📅</div>
                                    <p>No reservations found</p>
                                    <p className="text-sm">Reservations will appear here when customers make them.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredReservations.map((reservation) => (
                                <tr key={reservation.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{reservation.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {reservation.customerName?.charAt(0) || 'C'}
                                                    </span>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {reservation.customerName || 'Unknown Customer'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {reservation.customerEmail || 'No email'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(reservation.reservationDate)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formatTime(reservation.reservationTime)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {reservation.numberOfGuests || 'N/A'} guests
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Table {reservation.tableNumber || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(reservation.status)}`}>
                                                {reservation.status || 'PENDING'}
                                            </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setSelectedReservation(reservation)}
                                                    className="text-blue-600 hover:text-blue-900 text-xs"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(reservation.id)}
                                                    className="text-red-600 hover:text-red-900 text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <select
                                                value={reservation.status || 'PENDING'}
                                                onChange={(e) => handleStatusUpdate(reservation.id, e.target.value)}
                                                disabled={updatingStatus === reservation.id}
                                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="CONFIRMED">Confirmed</option>
                                                <option value="CANCELLED">Cancelled</option>
                                                <option value="COMPLETED">Completed</option>
                                            </select>
                                            {updatingStatus === reservation.id && (
                                                <span className="text-xs text-gray-500">Updating...</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reservation Details Modal */}
            {selectedReservation && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-out scale-100">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Reservation #{selectedReservation.id}
                            </h3>
                            <button
                                onClick={() => setSelectedReservation(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                        {selectedReservation.customerName || 'Unknown'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                        {selectedReservation.customerEmail || 'No email'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Reservation Date</label>
                                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                        {formatDate(selectedReservation.reservationDate)}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Reservation Time</label>
                                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                        {formatTime(selectedReservation.reservationTime)}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                        {selectedReservation.numberOfGuests || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Table</label>
                                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                        Table {selectedReservation.tableNumber || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <span className={`inline-block px-3 py-2 text-sm font-medium rounded-full border ${getStatusColor(selectedReservation.status)}`}>
                                        {selectedReservation.status || 'PENDING'}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Created Date</label>
                                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                        {formatDateTime(selectedReservation.createdAt)}
                                    </p>
                                </div>
                            </div>



                            <div className="flex space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => setSelectedReservation(null)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Close
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Reservation Modal */}
            {showCreateForm && (
                <CreateReservation
                    onClose={() => setShowCreateForm(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
};

export default ReservationManagement;