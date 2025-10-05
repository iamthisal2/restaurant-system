import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Feedback from './pages/Feedback/Feedback';
import HomePage from './pages/HomePage/HomePage';
import AllFeedback from './pages/AllFeedback/AllFeedback';

function App() {
  const [showFeedback, setShowFeedback] = useState(false);
  // New state to control the side panel's visibility
  const [showAllFeedbackPanel, setShowAllFeedbackPanel] = useState(false);

  return (
    <>
      {/* The feedback submission popup */}
      {showFeedback && <Feedback setShowFeedback={setShowFeedback} />}

      {/* Conditionally render the new side panel */}
      {showAllFeedbackPanel && <AllFeedback closePanel={() => setShowAllFeedbackPanel(false)} />}
      
      <main>
        {/* The Header and Footer will now be part of the HomePage */}
        <Routes>
          <Route 
            path='/' 
            element={<HomePage 
              setShowFeedback={setShowFeedback} 
              openPanel={() => setShowAllFeedbackPanel(true)} 
            />} 
          />
          {/* The /all-feedback route is no longer needed */}
        </Routes>
      </main>
    </>
  );
}

export default App;