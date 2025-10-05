import React from 'react';
import './FeedbackPrompt.css';

// This component now receives the 'openPanel' function
const FeedbackPrompt = ({ setShowFeedback, openPanel }) => {
  return (
    <div className='feedback-prompt'>
      <h2>Give Your Feedback</h2>
      <p>We'd love to hear what you think! Your feedback helps us improve.</p>
      <button onClick={() => setShowFeedback(true)}>
        Leave Feedback
      </button>
      {/* This now opens the side panel instead of navigating */}
      <a onClick={openPanel} className="view-feedback-link">
        View others' feedbacks
      </a>
    </div>
  );
};

export default FeedbackPrompt;