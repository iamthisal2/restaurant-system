import React, { useState } from 'react';
import axios from 'axios';
// You might need to import your popup CSS file here if it's separate
// import './FeedbackModal.css'; // Or reuse Feedback.css / AllFeedback.css

const ResponseModal = ({ feedbackId, onClose, onRespond }) => {
    // State to hold the admin's response text
    const [responseText, setResponseText] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            // Send POST request to the backend to add the response
            await axios.post(`http://localhost:8080/api/feedbacks/${feedbackId}/response`, { responseText });
            onRespond(); // Call the function passed in to refresh the feedback list
            onClose();   // Call the function passed in to close this modal
        } catch (error) {
            console.error("Failed to add response", error);
            alert("Failed to add response.");
        }
    };

    return (
        // Reuses the .feedback-popup styles for the background overlay
        <div className='feedback-popup'>
             {/* Reuses the .feedback-popup-container styles for the modal box */}
            <form onSubmit={handleSubmit} className='feedback-popup-container'>
                <div className='feedback-popup-title'>
                    <h2>Add Your Response</h2>
                    {/* Close button */}
                    <p onClick={onClose} className='close-btn'>&times;</p>
                </div>
                {/* Reuses the .feedback-popup-inputs styles for the form fields */}
                <div className='feedback-popup-inputs'>
                    {/* Textarea bound to the 'responseText' state */}
                    <textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} rows="6" placeholder="Type your response here..." required></textarea>
                    <button type="submit">Submit Response</button>
                </div>
            </form>
        </div>
    );
};

export default ResponseModal;