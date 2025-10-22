import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import axios from 'axios';
import './MyReservations.css';

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const currentUserId = localStorage.getItem("userId");

    // 2. Wrap fetchReservations in useCallback
    const fetchReservations = useCallback(async () => {
        if (!currentUserId) return; 

        try {
            const response = await axios.get(`http://localhost:8080/api/reservations/my-reservations?userId=${currentUserId}`);
            setReservations(response.data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    }, [currentUserId]); // Add dependency for useCallback

    // 3. Add fetchReservations to the useEffect dependency array
    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this reservation?")) {
            try {
                // Use PATCH to update status to "Cancelled" instead of DELETE
                await axios.patch(`http://localhost:8080/api/reservations/${id}/status`, {
                    status: 'Cancelled'
                });
                fetchReservations(); // Refresh the list
                alert("Reservation cancelled successfully!");
            } catch (error) { 
                alert("Failed to cancel reservation.");
                console.error("Cancellation error:", error);
            }
        }
    };

    const canCancelReservation = (reservation) => {
        if (reservation.status === 'Cancelled') return false;
        
        // Optional: Check if reservation date is in the future
        const reservationDate = new Date(reservation.reservationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Compare dates only
        
        return reservationDate >= today;
    };

    return (
        <div className='reservations-page'>
            <h1>My Reservations</h1>
            <div className='reservations-list'>
                {reservations.length > 0 ? reservations.map(res => (
                    <div key={res.id} className={`reservation-card ${res.status.toLowerCase()}`}>
                        <p><strong>Date:</strong> {res.reservationDate}</p>
                        <p><strong>Time:</strong> {res.reservationTime.slice(0, 5)}</p>
                        <p><strong>Guests:</strong> {res.numberOfGuests}</p>
                        <p><strong>Status:</strong> <span className='status-badge'>{res.status}</span></p>
                        
                        {/* Show cancel button for both Pending and Confirmed reservations that can be cancelled */}
                        {canCancelReservation(res) && (
                            <button onClick={() => handleCancel(res.id)} className='cancel-btn'>
                                Cancel Reservation
                            </button>
                        )}
                        
                        {/* Optional: Show message if reservation is already cancelled */}
                        {res.status === 'Cancelled' && (
                            <p className='cancelled-message'>This reservation has been cancelled</p>
                        )}
                    </div>
                )) : <p>You have no reservations.</p>}
            </div>
        </div>
    );
};

export default MyReservations;