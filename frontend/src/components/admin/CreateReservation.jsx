import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../Context/AdminContext';
import * as reservationService from '../../services/reservation.service';
import { showErrorToast } from '../../utils/toast.utils';

const CreateReservation = ({ onClose, onSuccess }) => {
    const { createReservationByAdmin, loading } = useAdmin();
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        numberOfGuests: 1,
        reservationDate: '',
        reservationTime: '',
        status: 'PENDING',
        tableId: ''
    });
    const [tables, setTables] = useState([]);
    const [availableTables, setAvailableTables] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchTables();
    }, []);

    useEffect(() => {
        if (formData.reservationDate && formData.reservationTime && formData.numberOfGuests) {
            fetchAvailableTables();
        }
    }, [formData.reservationDate, formData.reservationTime, formData.numberOfGuests]);

    const fetchTables = async () => {
        try {
            const response = await reservationService.getTables();
            setTables(response.data || []);
        } catch (error) {
            console.error('Failed to fetch tables:', error);
        }
    };

    const fetchAvailableTables = async () => {
        try {
            const response = await reservationService.getAvailableTables(
                formData.reservationDate,
                formData.reservationTime,
                formData.numberOfGuests
            );
            setAvailableTables(response.data || []);
        } catch (error) {
            console.error('Failed to fetch available tables:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Customer name is required';
        }

        if (!formData.customerEmail.trim()) {
            newErrors.customerEmail = 'Customer email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
            newErrors.customerEmail = 'Please enter a valid email address';
        }

        if (!formData.reservationDate) {
            newErrors.reservationDate = 'Reservation date is required';
        } else if (new Date(formData.reservationDate) < new Date().toISOString().split('T')[0]) {
            newErrors.reservationDate = 'Reservation date cannot be in the past';
        }

        if (!formData.reservationTime) {
            newErrors.reservationTime = 'Reservation time is required';
        }

        if (!formData.tableId) {
            newErrors.tableId = 'Please select a table';
        }

        if (formData.numberOfGuests < 1) {
            newErrors.numberOfGuests = 'Number of guests must be at least 1';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await createReservationByAdmin(formData);
            onSuccess?.();
            onClose?.();
        } catch (error) {
            console.error('Failed to create reservation:', error);
            showErrorToast('Failed to create reservation. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 21; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push(timeString);
            }
        }
        return slots;
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Create Reservation for Customer
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                            {errors.submit}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Customer Name *
                            </label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                                    errors.customerName ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter customer name"
                            />
                            {errors.customerName && (
                                <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Customer Email *
                            </label>
                            <input
                                type="email"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                                    errors.customerEmail ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter customer email"
                            />
                            {errors.customerEmail && (
                                <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Guests *
                            </label>
                            <input
                                type="number"
                                name="numberOfGuests"
                                value={formData.numberOfGuests}
                                onChange={handleInputChange}
                                min="1"
                                max="20"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                                    errors.numberOfGuests ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.numberOfGuests && (
                                <p className="text-red-500 text-sm mt-1">{errors.numberOfGuests}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reservation Date *
                            </label>
                            <input
                                type="date"
                                name="reservationDate"
                                value={formData.reservationDate}
                                onChange={handleInputChange}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                                    errors.reservationDate ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.reservationDate && (
                                <p className="text-red-500 text-sm mt-1">{errors.reservationDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reservation Time *
                            </label>
                            <select
                                name="reservationTime"
                                value={formData.reservationTime}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                                    errors.reservationTime ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select time</option>
                                {getTimeSlots().map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                            {errors.reservationTime && (
                                <p className="text-red-500 text-sm mt-1">{errors.reservationTime}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Table *
                            </label>
                            <select
                                name="tableId"
                                value={formData.tableId}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                                    errors.tableId ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select table</option>
                                {availableTables.length > 0 ? (
                                    availableTables.map(table => (
                                        <option key={table.id} value={table.id}>
                                            Table {table.tableNumber} (Capacity: {table.capacity})
                                        </option>
                                    ))
                                ) : (
                                    tables.map(table => (
                                        <option key={table.id} value={table.id}>
                                            Table {table.tableNumber} (Capacity: {table.capacity})
                                        </option>
                                    ))
                                )}
                            </select>
                            {errors.tableId && (
                                <p className="text-red-500 text-sm mt-1">{errors.tableId}</p>
                            )}
                            {formData.reservationDate && formData.reservationTime && availableTables.length === 0 && (
                                <p className="text-yellow-600 text-sm mt-1">
                                    No available tables for the selected date and time. Showing all tables.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Reservation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateReservation;
