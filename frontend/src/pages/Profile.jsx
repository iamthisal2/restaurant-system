import { useState } from "react";
import {LOCAL_AUTH_TOKEN_KEY, LOCAL_USER_KEY, useAuth} from "../Context/AuthContext";
import { updateMe, disableMe } from "../services/user.service.js";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { currentUser, setCurrentUser, setAuthToken, logout } = useAuth();
    const navigate = useNavigate();
    const [showDisableConfirm, setShowDisableConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    if (!currentUser) {
        navigate("/login");
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Remove password field if empty
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }

            const updatedUser = await updateMe(updateData);
            setCurrentUser({
                ...updatedUser,
                email: updatedUser.data.email,
                name: updatedUser.data.name
            });
            setAuthToken(updatedUser.data.token);

            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({
                id: updatedUser.data.id,
                role: updatedUser.data.role,
                email: updatedUser.data.email,
                name: updatedUser.data.name
            }));
            localStorage.setItem(LOCAL_AUTH_TOKEN_KEY, updatedUser.data.token);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
            setFormData(prev => ({ ...prev, password: "" })); // Clear password field
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
            console.error("Failed to update profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDisable = async () => {
        setLoading(true);
        try {
            await disableMe();
            logout()
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to disable account. Please try again.' });
            console.error("Failed to disable account:", err);
        } finally {
            setLoading(false);
            setShowDisableConfirm(false);
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setFormData({
            name: currentUser.name,
            email: currentUser.email,
            password: ""
        });
        setMessage({ type: '', text: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Manage your account information and preferences
                    </p>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        message.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                        <div className="flex items-center">
                            <svg className={`w-5 h-5 mr-2 ${
                                message.type === 'success' ? 'text-green-400' : 'text-red-400'
                            }`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            {message.text}
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                    <div className="px-6 py-8">
                        {!isEditing ? (
                            /* View Mode */
                            <div className="space-y-8">
                                {/* Profile Information */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Full Name
                                            </label>
                                            <p className="text-lg text-gray-900 font-medium">{currentUser.name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email Address
                                            </label>
                                            <p className="text-lg text-gray-900 font-medium">{currentUser.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Actions */}
                                <div className="border-t border-gray-200 pt-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Actions</h2>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-yellow-800">
                                                    Important Information
                                                </h3>
                                                <div className="mt-2 text-sm text-yellow-700">
                                                    <p>
                                                        You can update your profile information or temporarily disable your account.
                                                        Disabling your account is reversible by contacting support.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit Profile
                                        </button>

                                        <button
                                            onClick={() => setShowDisableConfirm(true)}
                                            disabled={loading}
                                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-200"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Disable Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Edit Mode */
                            <form onSubmit={handleUpdate} className="space-y-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile Information</h2>

                                <div className="grid grid-cols-1 gap-6 max-w-2xl">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter new password to change it"
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        <p className="mt-2 text-sm text-gray-500">
                                            Leave this field empty if you don't want to change your password.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating Profile...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Save Changes
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        disabled={loading}
                                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Disable Account Confirmation Modal */}
            {showDisableConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 transform transition-all">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Disable Your Account?
                                </h3>
                            </div>
                        </div>

                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                This will temporarily disable your account. You can reactivate it by contacting support.
                                Your data will be preserved but you won't be able to access the platform until reactivation.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleDisable}
                                disabled={loading}
                                className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-200"
                            >
                                {loading ? 'Disabling...' : 'Yes, Disable Account'}
                            </button>
                            <button
                                onClick={() => setShowDisableConfirm(false)}
                                disabled={loading}
                                className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}