import React, { useState } from 'react';
import axios from 'axios';
// You might need to import your popup CSS file here if it's separate
// import './FeedbackModal.css'; // Or reuse Feedback.css / AllFeedback.css

const EditFeedbackModal = ({ feedback, onClose, onUpdate }) => {
    // Initialize state with the feedback data passed in
    const [data, setData] = useState(feedback);

    // Update state when input fields change
    const onChangeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            // Send PUT request to the backend to update the feedback
            await axios.put(`http://localhost:8080/api/feedbacks/${feedback.id}`, data);
            onUpdate(); // Call the function passed in to refresh the feedback list
            onClose();  // Call the function passed in to close this modal
        } catch (error) {
            console.error("Failed to update feedback", error);
            alert("Failed to update feedback.");
        }
    };

    return (
        // Reuses the .feedback-popup styles for the background overlay
        <div className='feedback-popup'>
            {/* Reuses the .feedback-popup-container styles for the modal box */}
            <form onSubmit={handleSubmit} className='feedback-popup-container'>
                <div className='feedback-popup-title'>
                    <h2>Edit Feedback</h2>
                    {/* Close button */}
                    <p onClick={onClose} className='close-btn'>&times;</p>
                </div>
                {/* Reuses the .feedback-popup-inputs styles for the form fields */}
                <div className='feedback-popup-inputs'>
                    {/* Form fields bound to the 'data' state */}
                    <input name='authorName' onChange={onChangeHandler} value={data.authorName} type="text" placeholder="Author Name" required readOnly /> {/* Usually don't allow changing name/email */}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder="Email" required readOnly />
                    <input name='rating' onChange={onChangeHandler} value={data.rating} type="number" min="1" max="5" placeholder="Rating" required />
                    <textarea name='content' onChange={onChangeHandler} value={data.content} rows="6" placeholder="Feedback Content" required></textarea>
                    <button type="submit">Update Feedback</button>
                </div>
            </form>
        </div>
    );
};

export default EditFeedbackModal;