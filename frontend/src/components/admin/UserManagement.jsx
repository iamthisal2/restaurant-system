import React, { useState } from 'react';
import { useAdmin } from '../../Context/AdminContext';
import { showErrorToast } from '../../utils/toast.utils';

const UserManagement = () => {
    const { users, deleteUser, updateUser, disableUser, createUser,  error, setError } = useAdmin();
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'USER',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'USER'
        });
        setShowModal(true);
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if(!editingUser && !formData.password) {
            errors.password = 'Password is required for new users';
        } else if(!editingUser && formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!formData.role) {
            errors.role = 'Role is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
            } else {
                await createUser(formData);
            }
            setShowModal(false);
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                role: 'USER'
            });
            setFormErrors({});

        } catch (error) {
            console.error('Error saving user:', error);
            showErrorToast('Failed to save user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
            } catch (error) {
                console.error('Error deleting user:', error);
                showErrorToast('Failed to delete user');
            }
        }
    };

    const handleDisable = async (userId) => {
        if (window.confirm('Are you sure you want to disable this user?')) {
            try {
                await disableUser(userId);
            } catch (error) {
                console.error('Error disabling user:', error);
                showErrorToast('Failed to disable user');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            role: 'USER',
            password: '',
        });
        setFormErrors({});
        setEditingUser(null);
        setShowModal(false);
        setError(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-end items-center space-x-4">
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                        Total Users: {users.length}
                    </div>
                </div>

                <button
                    onClick={() => {
                        setEditingUser(null);
                        setFormData({
                            name: '',
                            email: '',
                            role: 'USER'
                        });
                        setShowModal(true);
                    }}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center space-x-2"
                >
                    <span>Add User</span>
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-soft border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {user.name?.charAt(0) || 'U'}
                                                </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.name || 'Unknown User'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{user.email || 'No email'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            user.role === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {user.role || 'USER'}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.enabled ? 'Active' : 'Disabled'}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.createdDate ? new Date(user.createdDate).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {user.role !== 'ADMIN' && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDisable(user.id)}
                                                className="text-yellow-600 hover:text-yellow-900"
                                            >
                                                {user.enabled ? 'Disable' : 'Enable'}
                                            </button>
                                            {/*<button*/}

                                            {/*    onClick={() => handleDelete(user.id)}*/}
                                            {/*    className="text-red-600 hover:text-red-900"*/}
                                            {/*>*/}
                                            {/*    Delete*/}
                                            {/*</button>*/}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-100">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {editingUser ? 'Edit User' : 'Add New User'}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {editingUser ? 'Update user information' : 'Create a new user account'}
                                </p>
                            </div>
                            <button
                                onClick={resetForm}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value });
                                            if (formErrors.name) {
                                                setFormErrors({ ...formErrors, name: '' });
                                            }
                                        }}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                                            formErrors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                        }`}
                                        placeholder="Enter full name"
                                        required
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            if (formErrors.email) {
                                                setFormErrors({ ...formErrors, email: '' });
                                            }
                                        }}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                                            formErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                        }`}
                                        placeholder="Enter email address"
                                        required
                                    />
                                    {formErrors.email && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        User Role *
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => {
                                            setFormData({ ...formData, role: e.target.value });
                                            if (formErrors.role) {
                                                setFormErrors({ ...formErrors, role: '' });
                                            }
                                        }}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                                            formErrors.role ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                        }`}
                                    >
                                        <option value="USER">Regular User</option>
                                        <option value="ADMIN">Administrator</option>
                                    </select>
                                    {formErrors.role && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
                                    )}
                                </div>

                                {!editingUser && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password *
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => {
                                                setFormData({ ...formData, password: e.target.value });
                                                if (formErrors.password) {
                                                    setFormErrors({ ...formErrors, password: '' });
                                                }
                                            }}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                                                formErrors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                            }`}
                                            placeholder="Enter password"
                                            required
                                        />
                                        {formErrors.password && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex space-x-3 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                                >
                                    {isSubmitting && (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    <span>
                                        {isSubmitting
                                            ? (editingUser ? 'Updating...' : 'Creating...')
                                            : (editingUser ? 'Update User' : 'Create User')
                                        }
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;