import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllFeedback.css';

const AllFeedback = ({ closePanel }) => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/feedbacks");
                setFeedbacks(response.data);
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
            }
        };
        fetchFeedbacks();
    }, []);

    const getAdminResponse = (feedback) => {
        if (feedback.response && feedback.response.responseText) {
            return feedback.response.responseText;
        }
        if (feedback.adminResponse) {
            return feedback.adminResponse;
        }
        return null;
    };

    const getAdminName = (feedback) => {
        if (feedback.response && feedback.response.responseAuthor) {
            return feedback.response.responseAuthor;
        }
        return "Admin";
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.log(error);
            return dateString;
        }
    };

    // Star rating display component
    const StarRating = ({ rating }) => {
        return (
            <div className="star-rating-display">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? 'filled' : ''}`}
                    >
                        ★
                    </span>
                ))}
                <span className="rating-text">{rating}/5</span>
            </div>
        );
    };

    return (
        <>
            <div className="feedback-panel-overlay" onClick={closePanel}></div>

            <div className='feedback-panel'>
                <div className="panel-header">
                    <h2>Guest Feedback</h2>
                    <p onClick={closePanel} className='close-btn'>&times;</p>
                </div>
                <div className='panel-content'>
                    {feedbacks.length > 0 ? feedbacks.map((item) => {
                        const adminResponse = getAdminResponse(item);
                        const adminName = getAdminName(item);
                        
                        return (
                            <div key={item.id} className='panel-feedback-item'>
                                {/* Feedback Header */}
                                <div className="feedback-header">
                                    <div className="user-info">
                                        <div className="avatar">
                                            {item.authorName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="user-details">
                                            <h3>{item.authorName}</h3>
                                            <span className="feedback-date">
                                                {formatDate(item.submittedDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Star Rating */}
                                <StarRating rating={item.rating} />
                                
                                {/* Feedback Content */}
                                <div className="feedback-content">
                                    <p className='content'>"{item.content}"</p>
                                </div>
                                
                                {/* Admin Response */}
                                {adminResponse && (
                                    <div className="admin-response">
                                        <div className="admin-header">
                                            <div className="admin-avatar">
                                                {adminName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="admin-info">
                                                <strong>{adminName}</strong>
                                                <span className="response-role">Restaurant Manager</span>
                                            </div>
                                        </div>
                                        <p className="response-content">"{adminResponse}"</p>
                                        {item.response && item.response.createdAt && (
                                            <small className="response-date">
                                                {formatDate(item.response.createdAt)}
                                            </small>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    }) : (
                        <div className="no-feedback">
                            <div className="no-feedback-icon">💬</div>
                            <p>No feedback yet</p>
                            <span>Be the first to share your experience!</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AllFeedback;