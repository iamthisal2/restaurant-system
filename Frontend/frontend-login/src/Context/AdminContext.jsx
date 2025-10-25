import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as adminService from '../services/admin.service';
import { createToast } from '../utils/toast.utils';


const AdminContext = createContext();


export const AdminProvider = ({ children }) => {
    const { currentUser, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

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


    // Check if user is admin
    const isAdmin = currentUser?.role === 'ADMIN';

    const value = {
        loading,
        error,
        setError,
        users,
        isAdmin,
        // User management
        fetchUsers,
        deleteUser,
        updateUser,
        disableUser,
        createUser
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
