import React, { useEffect } from 'react';
import { useAdmin } from '../Context/AdminContext';
import UserManagement from '../components/admin/UserManagement';
import './AdminPanel.css';

const AdminPanel = () => {
    const { isAdmin, fetchUsers, loading, error } = useAdmin();

    useEffect(() => {
        if (isAdmin) {
            console.log("Fetching users..."); // Debug log
            fetchUsers();
        }
    }, [isAdmin, fetchUsers]);

    if (!isAdmin) {
        return (
            <div className="admin-access-denied">
                <div>
                    <div className="icon">🚫</div>
                    <h1>Access Denied</h1>
                    <p>You don't have permission to access the admin panel.</p>
                </div>
            </div>
        );
    }

    const handleRefresh = () => {
        fetchUsers();
    };

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1>User Management</h1>
                <button onClick={handleRefresh} disabled={loading}>
                    {loading ? "Loading..." : "🔄 Refresh"}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            {loading && !error ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading users...</p>
                </div>
            ) : (
                <UserManagement />
            )}
        </div>
    );
};

export default AdminPanel;