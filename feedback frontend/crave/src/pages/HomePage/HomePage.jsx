import React from 'react';
import Hero from '../../components/Hero/Hero';
import FeedbackPrompt from '../../components/FeedbackPrompt/FeedbackPrompt';

// Receive both setShowFeedback (for the popup) and openPanel (for the side panel)
const HomePage = ({ setShowFeedback, openPanel }) => {
  return (
    <div className="app-container">
    
      <Hero />
      <FeedbackPrompt setShowFeedback={setShowFeedback} openPanel={openPanel} />
  
    </div>
  );
};

export default HomePage;