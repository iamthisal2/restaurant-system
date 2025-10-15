import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import axios from 'axios';
import './MyReservations.css';

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const currentUserEmail = localStorage.getItem("userEmail") || "test@example.com";

    // 2. Wrap fetchReservations in useCallback
    const fetchReservations = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reservations/my-reservations?email=${currentUserEmail}`);
            setReservations(response.data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    }, [currentUserEmail]); // Add dependency for useCallback

    // 3. Add fetchReservations to the useEffect dependency array
    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this reservation?")) {
            try {
                await axios.delete(`http://localhost:8080/api/reservations/${id}`);
                fetchReservations();
            } catch (error) { 
                alert("Failed to cancel reservation.");
                console.error("Cancellation error:", error); // It's also good practice to log the error
            }
        }
    };

    return (
        <div className='reservations-page'>
            <h1>My Reservations</h1>
            <div className='reservations-list'>
                {reservations.length > 0 ? reservations.map(res => (
                    <div key={res.id} className={`reservation-card ${res.status.toLowerCase()}`}>
                        <p><strong>Date:</strong> {res.reservationDate}</p>
                        <p><strong>Time:</strong> {res.reservationTime}</p>
                        <p><strong>Guests:</strong> {res.numberOfGuests}</p>
                        <p><strong>Status:</strong> <span className='status-badge'>{res.status}</span></p>
                        {res.status === 'Pending' && (
                            <button onClick={() => handleCancel(res.id)} className='cancel-btn'>Cancel</button>
                        )}
                    </div>
                )) : <p>You have no reservations.</p>}
            </div>
        </div>
    );
};

export default MyReservations;