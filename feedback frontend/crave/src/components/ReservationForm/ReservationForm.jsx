import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ReservationForm.css';

const ReservationForm = () => {
    const [formData, setFormData] = useState({
        customerName: localStorage.getItem('userName') || '',
        customerEmail: localStorage.getItem('userEmail') || '',
        reservationDate: '',
        reservationTime: '',
        numberOfGuests: 2,
        userId: localStorage.getItem('userId') || null
    });

    const [availableTimes, setAvailableTimes] = useState([]); // store backend times
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
        
        setFormData({ ...formData, [name]: value });
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
                } catch (error) {
                    console.error("Error fetching available times:", error);
                    setAvailableTimes([]); // clear list if none found
                } finally {
                    setLoadingTimes(false);
                }
            }
        };

        fetchAvailableTimes();
    }, [formData.reservationDate, formData.numberOfGuests]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedDate = new Date(formData.reservationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            setErrors({ ...errors, reservationDate: 'Please select a future date.' });
            return;
        }

        if (!formData.userId) {
            alert("Could not find user ID. Please log in again.");
            return;
        }
        try {
            await axios.post('http://localhost:8080/api/reservations', formData);
            alert('Your reservation request has been sent!');
            setFormData({
                ...formData,
                reservationDate: '',
                reservationTime: '',
            });
            setAvailableTimes([]);
        } catch (error) {
            console.error(error);
            alert('Failed to make reservation. Please try again.');
        }
    };

    return (
        <div className="reservation-section">
            <div className="reservation-header">
                <h2>Book a Table</h2>
                <Link to="/my-reservations" className="view-reservations-link">
                    View My Reservations
                </Link>
            </div>

            <form className="reservation-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    readOnly
                />

                <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    readOnly
                />

                <input
                type="date"
                name="reservationDate"
                value={formData.reservationDate}
                onChange={handleChange}
                min={getMinDate()} // Prevents past dates in date picker
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
                    <p>No available times for the selected date.</p>
                ) : null}

                <button type="submit">Book Now</button>
            </form>
        </div>
    );
};

export default ReservationForm;
