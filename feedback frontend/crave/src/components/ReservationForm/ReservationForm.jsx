import React, { useState } from 'react';
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
        userId: localStorage.getItem('userId') || null // Add userId from localStorage
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.userId) {
            alert("Could not find user ID. Please log in again.");
            return;
        }
        try {
            // The 'formData' object now includes the userId
            await axios.post('http://localhost:8080/api/reservations', formData);
            alert('Your reservation request has been sent!');
            setFormData({ 
                ...formData,
                reservationDate: '', 
                reservationTime: '', 
            });
        } catch (error) {
            alert('Failed to make reservation. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="reservation-section">
            <div className="reservation-header">
                <h2>Book a Table</h2>
                <Link to="/my-reservations" className="view-reservations-link">View My Reservations</Link>
            </div>
            <form className="reservation-form" onSubmit={handleSubmit}>
                {/* ... The rest of your JSX is correct and does not need to be changed ... */}
                <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Your Name" required readOnly />
                <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="Your Email" required readOnly />
                <input type="date" name="reservationDate" value={formData.reservationDate} onChange={handleChange} required />
                <input type="time" name="reservationTime" value={formData.reservationTime} onChange={handleChange} required />
                <input type="number" name="numberOfGuests" value={formData.numberOfGuests} onChange={handleChange} min="1" placeholder="Number of Guests" required />
                <button type="submit">Book Now</button>
            </form>
        </div>
    );
};

export default ReservationForm;