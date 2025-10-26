import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import * as ratingService from '../services/rating.service';
import * as foodService from '../services/food.service';
import StarRating from '../components/StarRating';
import { assets } from '../assets/assets';

const Ratings = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const [userRatings, setUserRatings] = useState([]);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [newRating, setNewRating] = useState(0);

    useEffect(() => {
        if (isAuthenticated && currentUser) {
            fetchUserRatings().then();
            fetchFoods().then();
        }
    }, [isAuthenticated, currentUser]);

    const fetchUserRatings = async () => {
        try {
            const response = await ratingService.getUserRatings(currentUser.id);
            if (response && response.data) {
                setUserRatings(response.data);
            }
        } catch (err) {
            console.error('Error fetching user ratings:', err);
        }
    };

    const fetchFoods = async () => {
        try {
            const response = await foodService.getAllFoods();
            if (response && response.data) {
                setFoods(response.data);
            }
        } catch (err) {
            console.error('Error fetching foods:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRateFood = (food) => {
        setSelectedFood(food);
        setNewRating(0);
        setShowRatingForm(true);
    };

    const handleSubmitRating = async () => {
        if (!selectedFood || newRating === 0) {
            alert('Please select a rating');
            return;
        }

        setLoading(true);
        try {
            const ratingData = {
                userId: currentUser.id,
                foodId: selectedFood.id,
                ratingScore: newRating
            };

            const response = await ratingService.addOrUpdateRating(ratingData);
            
            if (response && response.success) {
                setShowRatingForm(false);
                setSelectedFood(null);
                setNewRating(0);
                await fetchUserRatings();
                alert('Rating submitted successfully!');
            } else {
                setError('Failed to submit rating');
            }
        } catch (err) {
            console.error('Error submitting rating:', err);
            setError('Failed to submit rating');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRating = async (ratingId, foodId) => {
        if (!window.confirm('Are you sure you want to delete this rating?')) {
            return;
        }

        setLoading(true);
        try {
            const response = await ratingService.deleteRating(currentUser.id, foodId);
            if (response && response.success) {
                await fetchUserRatings();
                alert('Rating deleted successfully!');
            } else {
                setError('Failed to delete rating');
            }
        } catch (err) {
            console.error('Error deleting rating:', err);
            setError('Failed to delete rating');
        } finally {
            setLoading(false);
        }
    };

    const getFoodById = (foodId) => {
        return foods.find(food => food.id === foodId);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-medium text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-6">Please login to view and manage your ratings</p>
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading ratings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Ratings</h1>
                    <p className="text-gray-600">Rate the foods you've tried</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Rate New Food Section */}
                <div className="bg-white rounded-lg shadow-medium p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Rate a Food Item</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {foods.map((food) => (
                            <div key={food.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-soft transition-shadow">
                                <img 
                                    src={food.image || assets.logo} 
                                    alt={food.name}
                                    className="w-full h-32 object-cover rounded-lg mb-3"
                                />
                                <h3 className="font-semibold text-gray-800 mb-1">{food.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{food.description}</p>
                                <p className="text-primary-500 font-semibold mb-3">Rs {food.price}</p>
                                <button
                                    onClick={() => handleRateFood(food)}
                                    className="w-full bg-primary-500 text-white py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                                >
                                    Rate This Food
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* My Ratings Section */}
                <div className="bg-white rounded-lg shadow-medium p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">My Ratings</h2>
                    
                    {userRatings.length === 0 ? (
                        <div className="text-center py-8">
                            <img 
                                src={assets.rating_starts} 
                                alt="No ratings" 
                                className="w-24 h-24 mx-auto mb-4 opacity-50"
                            />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No ratings yet</h3>
                            <p className="text-gray-500">Start rating foods to help others discover great dishes!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {userRatings.map((rating) => {
                                const food = getFoodById(rating.foodId);
                                if (!food) return null;

                                return (
                                    <div key={rating.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={food.image || assets.logo} 
                                                alt={food.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{food.name}</h3>
                                                <p className="text-gray-600 text-sm">{food.description}</p>
                                                <p className="text-sm text-gray-500">
                                                    Rated on {formatDate(rating.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <div className="flex items-center justify-center mb-1">
                                                    <StarRating 
                                                        currentRating={rating.ratingScore} 
                                                        readOnly={true}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {rating.ratingScore} out of 5
                                                </span>
                                            </div>
                                            
                                            <button
                                                onClick={() => handleDeleteRating(rating.id, rating.foodId)}
                                                className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Delete rating"
                                            >
                                                <img src={assets.remove_icon_red} alt="Delete" className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Rating Form Modal */}
                {showRatingForm && selectedFood && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-strong p-6 max-w-md w-full mx-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Rate {selectedFood.name}</h3>
                                <button
                                    onClick={() => setShowRatingForm(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="text-center mb-6">
                                <img 
                                    src={selectedFood.image || assets.logo} 
                                    alt={selectedFood.name}
                                    className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
                                />
                                <p className="text-gray-600">{selectedFood.description}</p>
                            </div>
                            
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-600 mb-2">Your Rating:</p>
                                <StarRating 
                                    currentRating={newRating} 
                                    onRate={setNewRating}
                                />
                            </div>
                            
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowRatingForm(false)}
                                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitRating}
                                    disabled={loading || newRating === 0}
                                    className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Submitting...' : 'Submit Rating'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ratings;
