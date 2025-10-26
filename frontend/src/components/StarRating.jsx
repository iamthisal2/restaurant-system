import React, { useState } from 'react';
import { Star, X, Info, ChevronRight } from 'lucide-react';

const StarRating = ({ currentRating, onRate, onDelete, readOnly = false }) => {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [showRatingMenu, setShowRatingMenu] = useState(false);

    const handleStarClick = (rating) => {
        if (!readOnly && onRate) {
            onRate(rating);
            setShowRatingMenu(false); // Close menu after rating
        }
    };

    const handleMouseEnter = (rating) => {
        if (!readOnly) {
            setHoveredRating(rating);
        }
    };

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHoveredRating(0);
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete();
            setShowRatingMenu(false); // Close menu after delete
        }
    };

    const getStarClass = (index) => {
        const ratingToShow = hoveredRating || currentRating || 0;

        if (ratingToShow >= index) {
            return 'text-amber-500 fill-amber-500';
        } else {
            return 'text-gray-300';
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                {/* Stars Display */}
                <div
                    className={`flex items-center gap-1 ${readOnly ? '' : 'cursor-pointer'}`}
                    onMouseLeave={handleMouseLeave}
                >
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={rating}
                            type="button"
                            className={`p-1 transition-all duration-200 transform hover:scale-110 ${
                                !readOnly ? 'hover:text-amber-400' : ''
                            } ${getStarClass(rating)}`}
                            onClick={() => handleStarClick(rating)}
                            onMouseEnter={() => handleMouseEnter(rating)}
                            disabled={readOnly}
                        >
                            <Star
                                size={24}
                                className={`transition-colors duration-150 ${
                                    (hoveredRating >= rating || currentRating >= rating) ? 'fill-current' : ''
                                }`}
                            />
                        </button>
                    ))}

                    {/* Current rating display */}
                    {currentRating > 0 && (
                        <span className="ml-2 text-sm font-medium text-gray-700 bg-amber-100 px-2 py-1 rounded-md">
              {currentRating.toFixed(1)}
            </span>
                    )}
                </div>

                {/* Info Icon - Only show if user has rating or can rate */}
                {!readOnly && (
                    <button
                        onClick={() => setShowRatingMenu(!showRatingMenu)}
                        className="p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200 group relative"
                    >
                        <Info size={18} />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            Manage rating
                        </div>
                    </button>
                )}
            </div>

            {/* Rating Management Side Menu */}
            {showRatingMenu && (
                <div className="fixed inset-0 z-100 lg:relative lg:inset-auto">
                    {/* Backdrop for mobile */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
                        onClick={() => setShowRatingMenu(false)}
                    />

                    {/* Side Menu */}
                    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:absolute lg:right-0 lg:top-full lg:h-auto lg:w-72 lg:rounded-xl lg:border lg:border-gray-200 lg:mt-2">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Star size={18} className="text-amber-500" />
                                Rate this item
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
                            {/* Current Rating Status */}
                            {currentRating > 0 ? (
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
                                                    className={rating <= currentRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-lg font-bold text-green-700">
                      {currentRating.toFixed(1)}
                    </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm text-blue-800">
                                        You haven't rated this item yet.
                                    </p>
                                </div>
                            )}

                            {/* Quick Rating Options */}
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">Quick rate:</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => handleStarClick(rating)}
                                            className="flex items-center justify-center gap-1 p-2 border border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200"
                                        >
                                            <Star
                                                size={16}
                                                className={rating <= currentRating ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}
                                            />
                                            <span className="text-sm font-medium">{rating}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Detailed Rating */}
                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-700 mb-3">Set your rating:</p>
                                <div className="flex items-center gap-1 justify-center">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => handleStarClick(rating)}
                                            className="p-1 transition-all duration-200 transform hover:scale-110"
                                        >
                                            <Star
                                                size={28}
                                                className={`${
                                                    rating <= (hoveredRating || currentRating || 0)
                                                        ? 'text-amber-500 fill-amber-500'
                                                        : 'text-gray-300'
                                                } transition-colors duration-150`}
                                                onMouseEnter={() => handleMouseEnter(rating)}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Delete Rating Option */}
                            {currentRating > 0 && onDelete && (
                                <button
                                    onClick={handleDelete}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 rounded-lg transition-all duration-200 font-medium"
                                >
                                    <X size={18} />
                                    Remove Rating
                                </button>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <p className="text-xs text-gray-500 text-center">
                                Your feedback helps improve our service
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StarRating;