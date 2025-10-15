import React, { useState } from 'react';
import './Feedback.css';
import axios from 'axios';

const Feedback = ({ setShowFeedback }) => {
  const [data, setData] = useState({
    authorName: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
    rating: 0,
    content: "",
    userId: localStorage.getItem("userId") || null // Add userId from localStorage
  });

  // ... (onChangeHandler and handleStarClick are the same) ...
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const handleStarClick = (starValue) => {
    setData(data => ({ ...data, rating: starValue }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!data.userId) {
      alert("Could not find user ID. Please log in again.");
      return;
    }
    if (data.rating === 0) {
      alert("Please provide a star rating.");
      return;
    }
    const url = "http://localhost:8080/api/feedbacks";

    try {
      // The 'data' object now includes the userId
      const response = await axios.post(url, data);
      if (response.status === 200) {
        alert("Feedback submitted successfully!");
        setShowFeedback(false);
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
        {/* ... The rest of your JSX is correct and does not need to be changed ... */}
        <div className='feedback-popup-title'>
          <h2>We'd Love to Hear From You!</h2>
          <p onClick={() => setShowFeedback(false)} className='close-btn'>&times;</p>
        </div>
        
        <p>Please share your feedback below.</p>
        <div className='feedback-popup-inputs'>
          <input name='authorName' onChange={onChangeHandler} value={data.authorName} type="text" placeholder="Your Name" required readOnly />
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder="Your Email" required readOnly />
          
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