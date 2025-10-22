import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminReservationModal.css';

const AdminReservationModal = ({ onClose, onReservationCreated }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        reservationDate: '',
        reservationTime: '',
        numberOfGuests: 2,
        // Remove userId from formData since it's not needed for admin
    });

    const [availableTimes, setAvailableTimes] = useState([]);
    const [loadingTimes, setLoadingTimes] = useState(false);
    const [errors, setErrors] = useState({});

    // Get tomorrow's date for min attribute
    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Clear errors when user changes input
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
        
        // Date validation
        if (name === 'reservationDate' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                setErrors({ ...errors, reservationDate: 'Please select a future date.' });
                return;
            }
        }
        
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fetch available times when date or guests change
    useEffect(() => {
        const fetchAvailableTimes = async () => {
            if (formData.reservationDate && formData.numberOfGuests > 0) {
                setLoadingTimes(true);
                try {
                    const dateString = new Date(formData.reservationDate).toISOString().split('T')[0];
                    
                    const response = await axios.get(
                        `http://localhost:8080/api/reservations/available-times`,
                        {
                            params: {
                                date: dateString,
                                guests: formData.numberOfGuests
                            }
                        }
                    );
                    setAvailableTimes(response.data);
                    
                    // Auto-select the first available time if none selected
                    if (response.data.length > 0 && !formData.reservationTime) {
                        setFormData(prev => ({ ...prev, reservationTime: response.data[0] }));
                    }
                } catch (error) {
                    console.error("Error fetching available times:", error);
                    setAvailableTimes([]);
                } finally {
                    setLoadingTimes(false);
                }
            } else {
                setAvailableTimes([]);
            }
        };

        fetchAvailableTimes();
    }, [formData.reservationDate, formData.numberOfGuests]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation
        const selectedDate = new Date(formData.reservationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            setErrors({ ...errors, reservationDate: 'Please select a future date.' });
            return;
        }

        if (!formData.reservationTime) {
            alert("Please select an available time.");
            return;
        }

        try {
            // Add status: 'Confirmed' to the form data
            const reservationData = {
                ...formData,
                status: 'Confirmed' // Automatically confirm admin-created reservations
                // userId is not included, so it will be null in the backend
            };

            await axios.post('http://localhost:8080/api/reservations', reservationData);
            alert('Reservation created and confirmed successfully!');
            onReservationCreated();
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert(error.response.data);
            } else {
                alert('Failed to create reservation. Please try again.');
            }
            console.error(error);
        }
    };

    return (
        <div className='modal-popup'>
            <form className='modal-popup-container reservation' onSubmit={handleSubmit}>
                <div className='modal-popup-title'>
                    <h2>Create New Reservation</h2>
                    <p onClick={onClose} className='close-btn'>&times;</p>
                </div>
                <div className='modal-popup-inputs'>
                    <input 
                        type="text" 
                        name="customerName" 
                        value={formData.customerName}
                        onChange={handleChange} 
                        placeholder="Customer Name" 
                        required 
                    />
                    <input 
                        type="email" 
                        name="customerEmail" 
                        value={formData.customerEmail}
                        onChange={handleChange} 
                        placeholder="Customer Email" 
                        required 
                    />
                    {/* Remove User ID field since it's not needed for admin */}
                    
                    <input 
                        type="date" 
                        name="reservationDate" 
                        value={formData.reservationDate}
                        onChange={handleChange} 
                        min={getMinDate()}
                        required 
                    />
                    {errors.reservationDate && (
                        <p className="error-message">{errors.reservationDate}</p>
                    )}
                    
                    <input 
                        type="number" 
                        name="numberOfGuests" 
                        value={formData.numberOfGuests}
                        onChange={handleChange} 
                        min="1" 
                        placeholder="Number of Guests" 
                        required 
                    />

                    {/* Available Times Dropdown */}
                    {loadingTimes ? (
                        <p>Loading available times...</p>
                    ) : availableTimes.length > 0 ? (
                        <select
                            name="reservationTime"
                            value={formData.reservationTime}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Time</option>
                            {availableTimes.map((time, index) => (
                                <option key={index} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    ) : formData.reservationDate ? (
                        <p className="no-times-message">No available times for the selected date.</p>
                    ) : null}

                    <button type="submit">Create & Confirm Reservation</button>
                </div>
            </form>
        </div>
    );
};

export default AdminReservationModal;