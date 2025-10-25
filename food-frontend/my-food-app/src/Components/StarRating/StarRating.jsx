import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ currentRating, onRate, readOnly = false, size = 24 }) => {
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleStarClick = (rating) => {
        if (!readOnly && onRate) {
            onRate(rating);
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

    const getStarClass = (index) => {
        const ratingToShow = hoveredRating || currentRating || 0;

        if (ratingToShow >= index) {
            return 'star-filled';
        } else {
            return 'star-empty';
        }
    };

    return (
        <div className="star-rating-container">
            <div
                className={`star-rating ${readOnly ? 'read-only' : 'interactive'}`}
                onMouseLeave={handleMouseLeave}
            >
                {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        className={`star-button ${getStarClass(rating)}`}
                        onClick={() => handleStarClick(rating)}
                        onMouseEnter={() => handleMouseEnter(rating)}
                        disabled={readOnly}
                        style={{ fontSize: `${size}px` }}
                    >
                        ★
                    </button>
                ))}

                {/* Current rating display */}
                {currentRating > 0 && (
                    <span className="rating-badge">
                        {currentRating.toFixed(1)}
                    </span>
                )}
            </div>
        </div>
    );
};

export default StarRating;
