import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as adminService from '../services/admin.service';
import * as feedbackService from '../services/feedback.service';
import * as reservationService from '../services/reservation.service';
import { createToast } from '../utils/toast.utils';


const AdminContext = createContext();


export const AdminProvider = ({ children }) => {
    const { currentUser} = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Data states
    const [feedbacks, setFeedbacks] = useState([]);
    const [reservations, setReservations] = useState([]);

    // Feedback Management
    const fetchFeedbacks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await feedbackService.getAllFeedbacks();
            setFeedbacks(response.data || []);
        } catch (err) {
            setError('Failed to fetch feedbacks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteFeedback = async (feedbackId) => {
        setLoading(true);
        try {
            const response = await feedbackService.deleteFeedback(feedbackId);
            createToast(response, 'Feedback deleted successfully', 'Failed to delete feedback');
            if (response && !response.success === false) {
                setFeedbacks(feedbacks.filter(feedback => feedback.id !== feedbackId));
            }
        } catch (err) {
            setError('Failed to delete feedback');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addFeedbackResponse = async (feedbackId, responseData) => {
        setLoading(true);
        try {
            const response = await feedbackService.addFeedbackResponse(feedbackId, responseData);
            createToast(response, 'Response added successfully', 'Failed to add response');
            if (response && response.data) {
                setFeedbacks(feedbacks.map(feedback => 
                    feedback.id === feedbackId ? { ...feedback, response: response.data } : feedback
                ));
            }
        } catch (err) {
            setError('Failed to add feedback response');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Reservation Management
    const fetchReservations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await reservationService.getAllReservations();
            setReservations(response.data || []);
        } catch (err) {
            setError('Failed to fetch reservations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateReservationStatus = async (reservationId, status) => {
        setLoading(true);
        try {
            const response = await reservationService.updateReservationStatus(reservationId, status);
            createToast(response, 'Reservation status updated successfully', 'Failed to update reservation status');
            if (response && response.data) {
                setReservations(reservations.map(reservation => 
                    reservation.id === reservationId ? response.data : reservation
                ));
            }
        } catch (err) {
            setError('Failed to update reservation status');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteReservation = async (reservationId) => {
        setLoading(true);
        try {
            const response = await reservationService.deleteReservation(reservationId);
            createToast(response, 'Reservation deleted successfully', 'Failed to delete reservation');
            if (response && !response.success === false) {
                setReservations(reservations.filter(reservation => reservation.id !== reservationId));
            }
        } catch (err) {
            setError('Failed to delete reservation');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

   
    const createReservationByAdmin = async (reservationData) => {
        setLoading(true);
        try {
            const response = await adminService.createReservationByAdmin(reservationData);
            createToast(response, 'Reservation created successfully', 'Failed to create reservation');
            if (response && response.data) {
                setReservations([...reservations, response.data]);
            }
            return response;
        } catch (err) {
            setError('Failed to create reservation');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Check if user is admin
    const isAdmin = currentUser?.role === 'ADMIN';

    const value = {
        loading,
        error,
        setError,
        feedbacks,
        reservations,
        isAdmin,
        // Feedback management
        fetchFeedbacks,
        deleteFeedback,
        addFeedbackResponse,
        // Reservation management
        fetchReservations,
        updateReservationStatus,
        deleteReservation,
        //Reservation management
        createReservationByAdmin
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};


export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
