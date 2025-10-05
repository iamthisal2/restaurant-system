import React, { useState } from 'react';
import './Feedback.css';
import axios from 'axios';

const Feedback = ({ setShowFeedback }) => {
  const [data, setData] = useState({
    authorName: "",
    email: "",
    rating: 0, // Initialize rating to 0
    content: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  // New handler for star clicks
  const handleStarClick = (starValue) => {
    setData(data => ({ ...data, rating: starValue }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Basic validation for rating
    if (data.rating === 0) {
      alert("Please provide a star rating.");
      return;
    }

    const url = "http://localhost:8080/api/feedbacks";

    try {
      const response = await axios.post(url, data);
      if (response.status === 200) {
        alert("Feedback submitted successfully!");
        setShowFeedback(false);
        // Reset form data including rating
        setData({ authorName: "", email: "", rating: 0, content: "" });
      } else {
        alert("Error submitting feedback.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error(error);
    }
  }

  return (
    <div className='feedback-popup'>
      <form onSubmit={onSubmitHandler} className='feedback-popup-container'>
        <div className='feedback-popup-title'>
          <h2>We'd Love to Hear From You!</h2>
          <p onClick={() => setShowFeedback(false)} className='close-btn'>&times;</p>
        </div>
        
        <p>Please share your feedback below.</p>
        <div className='feedback-popup-inputs'>
          <input name='authorName' onChange={onChangeHandler} value={data.authorName} type="text" placeholder="Your Name" required />
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder="Your Email" required />
          
          {/* Rating Stars Section */}
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <i 
                key={starValue}
                className={`fa-solid fa-star ${starValue <= data.rating ? 'filled' : ''}`}
                onClick={() => handleStarClick(starValue)}
              ></i>
            ))}
            <span className="rating-display">{data.rating > 0 ? `${data.rating}/5` : 'Rate us'}</span>
          </div>

          <textarea name='content' onChange={onChangeHandler} value={data.content} rows="6" placeholder="Your Feedback" required></textarea>
          <button type="submit">Submit</button>
        </div>
        
      </form>
    </div>
  );
};

export default Feedback;