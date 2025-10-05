import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllFeedback.css';

// This component receives a 'closePanel' function as a prop
const AllFeedback = ({ closePanel }) => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        // Fetch feedbacks when the panel opens
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/feedbacks");
                setFeedbacks(response.data);
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
            }
        };
        fetchFeedbacks();
    }, []);

    return (
        <>
            {/* The dark overlay. Clicking it will close the panel. */}
            <div className="feedback-panel-overlay" onClick={closePanel}></div>

            {/* The main side panel */}
            <div className='feedback-panel'>
                <div className="panel-header">
                    <h2>Guest Feedback</h2>
                    <p onClick={closePanel} className='close-btn'>&times;</p>
                </div>
                <div className='panel-content'>
                    {feedbacks.length > 0 ? feedbacks.map((item) => (
                        <div key={item.id} className='panel-feedback-item'>
                            <h3>{item.authorName}</h3>
                            <p className='rating'>Rating: {item.rating}/5</p>
                            <p className='content'>"{item.content}"</p>
                        </div>
                    )) : <p>No feedback yet.</p>}
                </div>
            </div>
        </>
    );
};

export default AllFeedback;