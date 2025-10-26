import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import * as feedbackService from '../services/feedback.service';
import { assets } from '../assets/assets';

const Feedback = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        content: '',
        rating: 0,
        userId: 0
    });

    useEffect(() => {
        if (isAuthenticated && currentUser) {
            fetchMyFeedbacks().then();
        }
    }, [isAuthenticated, currentUser]);

    const fetchMyFeedbacks = async () => {
        setLoading(true);
        setError(null);
        try {
            // Note: You'll need to implement getUserFeedbacks in feedback.service.js
            const response = await feedbackService.getUserFeedbacks(currentUser.id);
            if (response && response.data) {
                setFeedbacks(response.data);
            }
        } catch (err) {
            setError('Failed to fetch feedbacks');
            console.error('Error fetching feedbacks:', err);
        } finally {
            setLoading(false);
        }
    };

    console.log(feedbacks);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateFeedback = async (e) => {
        e.preventDefault();
        
        if (!formData.content.trim() || !formData.rating.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const feedbackData = {
                userId: currentUser.id,
                content: formData.content,
                rating: formData.rating
            };

            const response = await feedbackService.createFeedback(feedbackData);
            
            if (response && response.success) {
                setShowCreateForm(false);
                setFormData({

                    userId: currentUser.id,
                    content: '',
                    rating: 0,
                });
                await fetchMyFeedbacks();
                alert('Feedback submitted successfully!');
            } else {
                setError(response?.message || 'Failed to submit feedback');
            }
        } catch (err) {
            console.error('Error submitting feedback:', err);
            setError('Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFeedback = async (feedbackId) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) {
            return;
        }

        setLoading(true);
        try {
            const response = await feedbackService.deleteFeedback(feedbackId);
            if (response && response.success) {
                await fetchMyFeedbacks();
                alert('Feedback deleted successfully!');
            } else {
                setError('Failed to delete feedback');
            }
        } catch (err) {
            console.error('Error deleting feedback:', err);
            setError('Failed to delete feedback');
        } finally {
            setLoading(false);
        }
    };


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',

        });
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-medium text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-6">Please login to submit feedback</p>
                    <a 
                        href="/login" 
                        className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                    >
                        Login
                    </a>
                </div>
            </div>
        );
    }

    if (loading && !showCreateForm) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading feedback...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Feedback</h1>
                        <p className="text-gray-600">Share your thoughts and suggestions</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                        Submit Feedback
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Create Feedback Form */}
                {showCreateForm && (
                    <div className="bg-white rounded-lg shadow-medium p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Submit Feedback</h2>
                            <button
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setError(null);
                                    setFormData({
                                        content: '',
                                        rating: 0,
                                    });
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateFeedback} className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content *
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    required
                                    rows={5}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Please provide detailed feedback..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating (0-5)
                                </label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="5"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter a rating between 0 and 5"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Feedbacks List */}
                {feedbacks.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-medium p-8 text-center">
                        <img 
                            src={assets.basket_icon} 
                            alt="No feedback" 
                            className="w-24 h-24 mx-auto mb-4 opacity-50"
                        />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No feedback submitted yet</h3>
                        <p className="text-gray-500 mb-6">Share your thoughts to help us improve!</p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                        >
                            Submit Feedback
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {feedbacks?.map((feedback) => (
                            <div key={feedback.id} className="bg-white rounded-lg shadow-medium p-6 border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            FeedBack #{feedback?.id}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {formatDate(feedback.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-gray-700">{feedback.content}</p>
                                </div>

                                {feedback.response && (
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <h4 className="font-medium text-gray-800 mb-2">Admin Response:</h4>
                                        <p className="text-gray-700">{feedback.response.responseText}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Responded on {formatDate(feedback.response.createdAt)}
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="text-sm text-gray-600">
                                        ID: #{feedback.id}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteFeedback(feedback.id)}
                                        className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Delete Feedback
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feedback;
