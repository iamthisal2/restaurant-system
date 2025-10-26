import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as adminService from '../services/admin.service';
import * as foodService from '../services/food.service';

import * as ratingService from '../services/rating.service';
import * as feedbackService from '../services/feedback.service';
import * as reservationService from '../services/reservation.service';
import { createToast } from '../utils/toast.utils';


const AdminContext = createContext();


export const AdminProvider = ({ children }) => {
    const { currentUser, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Data states
    const [users, setUsers] = useState([]);
    const [foods, setFoods] = useState([]);
    const [orders, setOrders] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [reservations, setReservations] = useState([]);

    // User Management
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllUsersAdmin();
            setUsers(response.data || []);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllOrdersAdmin();
            setOrders(response.data || []);
        }catch (err) {
            setError('Failed to fetch orders');
        }
        finally {
            setLoading(false);

        }
    }, []
    );


    const createUser = async (userData) => {
        setLoading(true);
        try {
            const response = await adminService.createUser(userData);
            createToast(response, 'User created successfully', 'Failed to create user');
            if (response && response.data) {
                setUsers([...users, response.data]);
            }
        } catch (err) {
            setError('Failed to create user');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const deleteUser = async (userId) => {
        setLoading(true);
        try {
            const response = await adminService.deleteUserAdmin(userId);
            createToast(response, 'User deleted successfully', 'Failed to delete user');
            if (response && !response.success === false) {
                setUsers(users.filter(user => user.id !== userId));
            }
        } catch (err) {
            setError('Failed to delete user');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (userId, userData) => {
        setLoading(true);
        try {
            const response = await adminService.updateUserAdmin(userId, userData);
            createToast(response, 'User updated successfully', 'Failed to update user');
            if (response && response.data) {
                setUsers(users.map(user => user.id === userId ? response.data : user));
            }
        } catch (err) {
            setError('Failed to update user');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const disableUser = async (userId) => {
        setLoading(true);
        try {
            const response = await adminService.disableUserAdmin(userId);
            createToast(response, 'User status updated successfully', 'Failed to update user status');
            if (response && response.data) {
                setUsers(users.map(user => user.id === userId ? response.data : user));
            }
        } catch (err) {
            setError('Failed to disable user');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Food Management
    const fetchFoods = useCallback(async () => {
        setLoading(true);
        try {
            const response = await foodService.getAllFoods();
            setFoods(response.data || []);
        } catch (err) {
            setError('Failed to fetch foods');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createFood = async (foodData) => {
        setLoading(true);
        try {
            const response = await foodService.createFood(foodData);
            createToast(response, 'Food item created successfully', 'Failed to create food item');
            if (response && response.data) {
                setFoods([...foods, response.data]);
            }
        } catch (err) {
            setError('Failed to create food');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateFood = async (foodId, foodData) => {
        setLoading(true);
        try {
            const response = await foodService.updateFood(foodId, foodData);
            createToast(response, 'Food item updated successfully', 'Failed to update food item');
            if (response && response.data) {
                setFoods(foods.map(food => food.id === foodId ? response.data : food));
            }
        } catch (err) {
            setError('Failed to update food');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteFood = async (foodId) => {
        setLoading(true);
        try {
            const response = await foodService.deleteFood(foodId);
            createToast(response, 'Food item deleted successfully', 'Failed to delete food item');
            if (response && !response.success === false) {
                setFoods(foods.filter(food => food.id !== foodId));
            }
        } catch (err) {
            setError('Failed to delete food');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Rating Management
    const fetchRatings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await ratingService.getAllRatings();
            setRatings(response.data || []);
        } catch (err) {
            setError('Failed to fetch ratings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

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

    const updateOrderStatus = async (orderId, status) => {
        setLoading(true);
        try {
            const response = await adminService.updateOrderStatusAdmin(orderId, status);
            createToast(response, 'Order status updated successfully', 'Failed to update order status');
            if (response && response.data) {
                setOrders(orders.map(order => 
                    order.id === orderId ? { ...order, status: status } : order
                ));
            }
        } catch (err) {
            setError('Failed to update order status');
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
        users,
        foods,
        orders,
        ratings,
        feedbacks,
        reservations,
        isAdmin,
        // User management
        fetchUsers,
        deleteUser,
        updateUser,
        disableUser,
        createUser,
        // Food management
        fetchFoods,
        createFood,
        updateFood,
        deleteFood,
        // Rating management
        fetchRatings,
        // Feedback management
        fetchFeedbacks,
        deleteFeedback,
        addFeedbackResponse,
        // Reservation management
        fetchReservations,
        updateReservationStatus,
        deleteReservation,
        //Order management
        fetchOrders,
        updateOrderStatus,
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
