import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as ratingService from '../services/rating.service';
import { useCart } from '../Context/CartContext';
import { useAuth } from "../Context/AuthContext.jsx";
import {getFoodImageUrl} from "../utils/food.utils.js";
import { Star, Plus, Minus, ShoppingCart, ChefHat, Info, X } from 'lucide-react';

const FoodItem = ({ food }) => {
    const { currentUser } = useAuth();
    const { addToCart } = useCart();
    const [userRating, setUserRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showRatingMenu, setShowRatingMenu] = useState(false);
    const cardRef = useRef(null);
    const infoButtonRef = useRef(null);
    const popupRef = useRef(null);

    // Fetch user's existing rating when component mounts
    useEffect(() => {
        if (currentUser && currentUser.id) {
            fetchUserRating().then();
        }
    }, [currentUser, food.id]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showRatingMenu &&
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                infoButtonRef.current &&
                !infoButtonRef.current.contains(event.target)) {
                setShowRatingMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showRatingMenu]);

    const fetchUserRating = async () => {
        if (!currentUser || !currentUser.id) return;

        try {
            const response = await ratingService.getUserRatingForFood(currentUser.id, food.id);
            if (response && response.data) {
                setUserRating(response.data.ratingScore);
            }
        } catch (error) {
            if (error.response?.status !== 204) {
                console.error('Error fetching user rating:', error);
            }
        }
    };

    const handleRate = async (rating) => {
        if (!currentUser || !currentUser.id) {
            alert('Please login to rate this food item');
            return;
        }

        setLoading(true);
        try {
            const response = await ratingService.addOrUpdateRating({
                userId: currentUser.id,
                foodId: food.id,
                ratingScore: rating
            });
            if (response && response.success) {
                setUserRating(rating);
                setShowRatingMenu(false);
                window.location.reload();
            } else {
                alert('Failed to submit rating. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Failed to submit rating. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRating = async () => {
        if (!window.confirm('Are you sure you want to delete your rating?')) {
            return;
        }

        setLoading(true);
        try {
            const response = await ratingService.deleteRating(currentUser.id, food.id);
            if (response && response.success) {
                setUserRating(0);
                setShowRatingMenu(false);
                window.location.reload();
            } else {
                alert('Failed to delete rating. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting rating:', error);
            alert('Failed to delete rating. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!currentUser) {
            alert('Please login to add items to cart');
            return;
        }

        if (quantity < 1) {
            alert('Please select a valid quantity');
            return;
        }

        setAddingToCart(true);
        try {
            const success = await addToCart(food.id, quantity);
            if (success) {
                alert(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
                setQuantity(1);
            } else {
                alert('Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prev => prev > 1 ? prev - 1 : 1);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        }
    };

    const renderAverageStars = (avgRating) => {
        const fullStars = Math.floor(avgRating);
        const hasHalfStar = avgRating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center gap-1">
                {[...Array(fullStars)].map((_, index) => (
                    <Star
                        key={`full-${index}`}
                        size={16}
                        className="text-amber-500 fill-amber-500"
                    />
                ))}
                {hasHalfStar && (
                    <div className="relative">
                        <Star size={16} className="text-gray-300" />
                        <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                            <Star size={16} className="text-amber-500 fill-amber-500" />
                        </div>
                    </div>
                )}
                {[...Array(emptyStars)].map((_, index) => (
                    <Star
                        key={`empty-${index}`}
                        size={16}
                        className="text-gray-300"
                    />
                ))}
            </div>
        );
    };

    const RatingPopupMenu = () => {
        if (!showRatingMenu) return null;

        return ReactDOM.createPortal(
            <div
                ref={popupRef}
                className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-md"
                onClick={() => setShowRatingMenu(false)}
            >
                <div
                    className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-xl">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Star size={18} className="text-amber-500" />
                            Rate {food.name}
                        </h3>
                        <button
                            onClick={() => setShowRatingMenu(false)}
                            className="p-1 hover:bg-white rounded-lg transition-colors"
                        >
                            <X size={18} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {userRating > 0 ? (
                            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-800 font-medium mb-2">
                                    Your current rating:
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <Star
                                                key={rating}
                                                size={20}
                                                className={
                                                    rating <= userRating
                                                        ? 'text-amber-500 fill-amber-500'
                                                        : 'text-gray-300'
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className="text-lg font-bold text-green-700">
                                    {userRating.toFixed(1)}
                                </span>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-blue-800">
                                    You haven't rated this item yet.
                                </p>
                            </div>
                        )}

                        {/* Quick Rating Options */}
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">Quick rate:</p>
                            <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => handleRate(rating)}
                                        disabled={loading}
                                        className="flex flex-col items-center justify-center p-3 border border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 disabled:opacity-50"
                                    >
                                        <Star
                                            size={16}
                                            className={
                                                rating <= userRating
                                                    ? 'text-amber-500 fill-amber-500'
                                                    : 'text-gray-400'
                                            }
                                        />
                                        <span className="text-sm font-medium">{rating}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Detailed Rating */}
                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-3">Set precise rating:</p>
                            <div className="flex items-center gap-1 justify-center p-4 bg-gray-50 rounded-lg">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => handleRate(rating)}
                                        disabled={loading}
                                        className="p-2 transition-all duration-200 transform hover:scale-110 disabled:opacity-50"
                                    >
                                        <Star
                                            size={28}
                                            className={`${
                                                rating <= userRating
                                                    ? 'text-amber-500 fill-amber-500'
                                                    : 'text-gray-300'
                                            } transition-colors duration-150`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Delete Rating Option */}
                        {userRating > 0 && (
                            <button
                                onClick={handleDeleteRating}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 rounded-lg transition-all duration-200 font-medium disabled:opacity-50"
                            >
                                <Minus size={18} />
                                Remove My Rating
                            </button>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                        <p className="text-xs text-gray-500 text-center">
                            Your feedback helps improve our service
                        </p>
                    </div>
                </div>
            </div>,
            document.body
        );
    };


    return (
        <div
            ref={cardRef}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1 group relative"
        >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={getFoodImageUrl(food?.category) || "/assets/logo.png"}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
                    <ChefHat size={14} className="text-orange-500" />
                    <span className="text-xs font-medium text-gray-700 capitalize">
                        {food.category || 'Food'}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                <div className='flex items-center justify-between mb-3'>
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1 flex-1 mr-2">
                        {food.name}
                    </h3>
                    <span className="text-xl font-bold text-orange-600 whitespace-nowrap">
                        Rs. {food.price?.toFixed(2)}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {food.description}
                </p>

                {/* Average Rating */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                        {renderAverageStars(food.averageRating || 0)}
                        <span className="text-sm font-semibold text-gray-800 ml-1">
                            {food.averageRating ? food.averageRating.toFixed(1) : '0.0'}
                        </span>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <span className="text-xs text-gray-500">
                        ({food.totalRatings || 0} {food.totalRatings === 1 ? 'rating' : 'ratings'})
                    </span>
                </div>

                {/* User Rating Section - Only if Logged In */}
                {currentUser && currentUser.id && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
                                <Star size={16} className="text-gray-500" />
                                Your Rating:
                            </div>

                            {/* Info Button to Open Rating Menu */}
                            <button
                                ref={infoButtonRef}
                                onClick={() => setShowRatingMenu(true)}
                                className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200 relative group"
                            >
                                <Info size={16} />
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                    Manage rating
                                </div>
                            </button>
                        </div>

                        {/* Current User Rating Display */}
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <Star
                                        key={rating}
                                        size={20}
                                        className={rating <= userRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}
                                    />
                                ))}
                            </div>
                            {userRating > 0 ? (
                                <span className="text-sm font-semibold text-gray-700">
                                    {userRating.toFixed(1)}
                                </span>
                            ) : (
                                <span className="text-sm text-gray-500">
                                    Not rated yet
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Quantity Selector & Add to Cart */}
                <div className="flex gap-3 items-center">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <button
                            onClick={decrementQuantity}
                            disabled={quantity <= 1}
                            className="p-2 text-gray-600 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <Minus size={16} />
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            className="w-12 text-center bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-medium"
                        />
                        <button
                            onClick={incrementQuantity}
                            className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        className="flex-1 bg-orange-500 cursor-pointer hover:bg-orange-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        {addingToCart ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Adding...
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={18} />
                                Add {quantity} to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Rating Popup Menu */}
            <RatingPopupMenu />
        </div>
    );
};

export default FoodItem;