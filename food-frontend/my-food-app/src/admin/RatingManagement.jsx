import React, { useState, useEffect } from 'react';
import * as ratingService from '../services/rating.service';
import './RatingManagement.css';

const RatingManagement = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRating, setSelectedRating] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAllRatings();
    }, []);

    const fetchAllRatings = async () => {
        try {
            setLoading(true);
            const response = await ratingService.getAllRatings();
            if (response && response.data) {
                setRatings(response.data);
            }
        } catch (err) {
            console.error('Error fetching ratings:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredRatings = ratings.filter(rating => {
        if (filter === 'all') return true;
        if (filter === 'high') return rating.ratingScore >= 4;
        if (filter === 'low') return rating.ratingScore <= 2;
        return true;
    });

    const getRatingStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'rating-high';
        if (rating >= 3) return 'rating-medium';
        return 'rating-low';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading ratings...</p>
            </div>
        );
    }

    return (
        <div className="rating-management">
            {/* Header */}
            <div className="rating-header">
                <h2>Rating Management</h2>
                <div className="rating-header-actions">
                    <div className="rating-count">
                        Total Ratings: {ratings.length}
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Ratings</option>
                        <option value="high">High Ratings (4-5)</option>
                        <option value="low">Low Ratings (1-2)</option>
                    </select>
                </div>
            </div>

            {/* Rating Stats */}
            <div className="rating-stats">
                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                        <p className="stat-label">Average Rating</p>
                        <p className="stat-value">
                            {ratings.length > 0
                                ? (ratings.reduce((sum, r) => sum + r.ratingScore, 0) / ratings.length).toFixed(1)
                                : '0.0'
                            }
                        </p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <p className="stat-label">Total Ratings</p>
                        <p className="stat-value">{ratings.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👍</div>
                    <div className="stat-content">
                        <p className="stat-label">High Ratings</p>
                        <p className="stat-value">
                            {ratings.filter(r => r.ratingScore >= 4).length}
                        </p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👎</div>
                    <div className="stat-content">
                        <p className="stat-label">Low Ratings</p>
                        <p className="stat-value">
                            {ratings.filter(r => r.ratingScore <= 2).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Ratings Table */}
            <div className="ratings-table-container">
                <table className="ratings-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Food Item</th>
                            <th>Rating</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRatings.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-ratings">
                                    <div className="no-ratings-content">
                                        <div className="no-ratings-icon">⭐</div>
                                        <p>No ratings found</p>
                                        <p className="no-ratings-subtitle">Ratings will appear here when customers rate food items.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredRatings.map((rating) => (
                                <tr key={rating.id}>
                                    <td>
                                        <div className="customer-info">
                                            <div className="customer-avatar">
                                                {rating.customerName?.charAt(0) || 'A'}
                                            </div>
                                            <div className="customer-name">
                                                {rating.customerName || 'Anonymous'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="food-name">{rating.foodName || 'Unknown Food'}</td>
                                    <td>
                                        <div className="rating-display">
                                            <span className={`rating-stars ${getRatingColor(rating.ratingScore)}`}>
                                                {getRatingStars(rating.ratingScore)}
                                            </span>
                                            <span className="rating-score">
                                                ({rating.ratingScore}/5)
                                            </span>
                                        </div>
                                    </td>
                                    <td className="rating-date">
                                        {rating.createdAt ? new Date(rating.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => setSelectedRating(rating)}
                                                className="btn-view"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Rating Details Modal */}
            {selectedRating && (
                <div className="modal-overlay" onClick={() => setSelectedRating(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Rating Details</h3>
                            <button
                                onClick={() => setSelectedRating(null)}
                                className="modal-close"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="modal-grid">
                                <div className="modal-field">
                                    <label>Customer</label>
                                    <p>{selectedRating.customerName || 'Anonymous'}</p>
                                </div>
                                <div className="modal-field">
                                    <label>Food Item</label>
                                    <p>{selectedRating.foodName || 'Unknown Food'}</p>
                                </div>
                            </div>
                            
                            <div className="modal-field">
                                <label>Rating</label>
                                <div className="rating-display">
                                    <span className={`rating-stars-large ${getRatingColor(selectedRating.ratingScore)}`}>
                                        {getRatingStars(selectedRating.ratingScore)}
                                    </span>
                                    <span className="rating-score-large">
                                        ({selectedRating.ratingScore}/5)
                                    </span>
                                </div>
                            </div>
                            
                            <div className="modal-field">
                                <label>Date</label>
                                <p>
                                    {selectedRating.createdAt ? new Date(selectedRating.createdAt).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RatingManagement;
