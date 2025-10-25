// src/Components/FoodItem/FoodItem.jsx
import React, { useState, useEffect } from "react";
import StarRating from "../StarRating/StarRating";
import * as ratingService from "../../services/rating.service";
import "./FoodItem.css";

const FoodItem = ({ food }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [myRatingId, setMyRatingId] = useState(null);
  const [myCurrentRating, setMyCurrentRating] = useState(0);

  useEffect(() => {
    fetchAverageRating();
    loadMyRating();
  }, [food.id]);

  const loadMyRating = () => {
    const savedRatings = JSON.parse(localStorage.getItem('myRatings') || '{}');
    const myRating = savedRatings[food.id];
    if (myRating) {
      setMyRatingId(myRating.ratingId);
      setMyCurrentRating(myRating.ratingScore);
    }
  };

  const saveMyRating = (ratingId, ratingScore) => {
    const savedRatings = JSON.parse(localStorage.getItem('myRatings') || '{}');
    savedRatings[food.id] = { ratingId, ratingScore };
    localStorage.setItem('myRatings', JSON.stringify(savedRatings));
    setMyRatingId(ratingId);
    setMyCurrentRating(ratingScore);
  };

  const removeMyRating = () => {
    const savedRatings = JSON.parse(localStorage.getItem('myRatings') || '{}');
    delete savedRatings[food.id];
    localStorage.setItem('myRatings', JSON.stringify(savedRatings));
    setMyRatingId(null);
    setMyCurrentRating(0);
  };

  const fetchAverageRating = async () => {
    try {
      const response = await ratingService.getFoodAverageRating(food.id);
      if (response && response.data) {
        setAverageRating(response.data.averageRating || 0);
        setTotalRatings(response.data.totalRatings || 0);
      }
    } catch (err) {
      console.error('Error fetching average rating:', err);
    }
  };

  const handleRateClick = () => {
    setUserRating(myCurrentRating || 0);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      const ratingData = {
        foodId: food.id,
        ratingScore: userRating,
        customerName: customerName.trim() || "Anonymous"
      };

      console.log('Submitting rating:', ratingData);

      const response = await ratingService.addRating(ratingData);
      
      console.log('Rating response:', response);
      
      if (response && response.success) {
        alert(myRatingId ? 'Rating updated successfully!' : 'Rating submitted successfully!');
        saveMyRating(response.data.id, userRating);
        setShowRatingModal(false);
        setUserRating(0);
        setCustomerName("");
        await fetchAverageRating();
      } else {
        alert('Failed to submit rating: ' + (response?.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating. Please check if the backend is running on port 8080.');
    }
  };

  const handleDeleteRating = async () => {
    if (!myRatingId) {
      alert('No rating to delete');
      return;
    }

    if (!window.confirm('Are you sure you want to delete your rating?')) {
      return;
    }

    try {
      const response = await ratingService.deleteRating(myRatingId);
      
      if (response && response.success) {
        alert('Rating deleted successfully!');
        removeMyRating();
        setShowRatingModal(false);
        setUserRating(0);
        await fetchAverageRating();
      } else {
        alert('Failed to delete rating');
      }
    } catch (err) {
      console.error('Error deleting rating:', err);
      alert('Failed to delete rating');
    }
  };

  return (
    <>
      <div className="food-item">
        <img src={food.image || "https://via.placeholder.com/200"} alt={food.name} />
        <h3>{food.name}</h3>
        <p>{food.description}</p>
        <span className="food-price">Rs. {food.price.toFixed(2)}</span>
        
        {/* Rating Section */}
        <div className="food-rating-section">
          <div className="average-rating">
            <StarRating currentRating={averageRating} readOnly={true} size={20} />
            <span className="rating-count">({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})</span>
          </div>
          <button onClick={handleRateClick} className="rate-btn">
            {myCurrentRating > 0 ? 'Update Rating' : 'Rate this item'}
          </button>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="rating-modal-overlay" onClick={() => setShowRatingModal(false)}>
          <div className="rating-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="rating-modal-header">
              <h3>{myCurrentRating > 0 ? 'Update' : 'Rate'} {food.name}</h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="rating-modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="rating-modal-body">
              <img 
                src={food.image || "https://via.placeholder.com/200"} 
                alt={food.name}
                className="rating-modal-image"
              />
              <p className="rating-modal-description">{food.description}</p>
              
              <div className="rating-input-section">
                <label>Your Name (Optional):</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name or leave blank"
                  className="customer-name-input"
                />
              </div>
              
              <div className="rating-stars-section">
                <p>Your Rating:</p>
                <StarRating 
                  currentRating={userRating} 
                  onRate={setUserRating}
                  size={32}
                />
              </div>
            </div>
            
            <div className="rating-modal-footer">
              {myCurrentRating > 0 && (
                <button
                  onClick={handleDeleteRating}
                  className="btn-delete-rating"
                >
                  Delete Rating
                </button>
              )}
              <button
                onClick={() => setShowRatingModal(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={userRating === 0}
                className="btn-submit"
              >
                {myCurrentRating > 0 ? 'Update Rating' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodItem;
