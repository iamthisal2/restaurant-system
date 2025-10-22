import React, { useState } from 'react';
// 1. Make sure Routes, Route, AND Navigate are imported
import { Routes, Route, Navigate, Link } from 'react-router-dom'; 

// User Pages
import HomePage from './pages/HomePage/HomePage';
import AllFeedback from './pages/AllFeedback/AllFeedback'; // Side Panel
import MyReservations from './pages/MyReservations/MyReservations';
import Feedback from './pages/Feedback/Feedback'; // Popup

// Admin Pages
import AdminReservations from './pages/AdminReservations/AdminReservations';
import AdminFeedback from './pages/AdminFeedback/AdminFeedback';

// 2. Define a simple AdminDashboard component (or import if you have one)
const AdminDashboard = () => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <h1>Admin Dashboard</h1>
    <p>Welcome, Admin!</p>
    <nav style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
      <Link to="/admin/reservations" style={{ textDecoration: 'underline', color: 'blue' }}>
        Manage Reservations
      </Link>
      <Link to="/admin/feedback" style={{ textDecoration: 'underline', color: 'blue' }}>
        Manage Feedback
      </Link>
    </nav>
  </div>
);

function App() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAllFeedbackPanel, setShowAllFeedbackPanel] = useState(false);

  const userRole = localStorage.getItem('userRole');

  return (
    <>
      {/* Popups/Panels can stay outside main routing */}
      {showFeedback && <Feedback setShowFeedback={setShowFeedback} />}
      {showAllFeedbackPanel && <AllFeedback closePanel={() => setShowAllFeedbackPanel(false)} />}
      
      <main>
        {userRole === 'ADMIN' ? (
          // Admin Routes
          <Routes>
            <Route path="/" element={<AdminDashboard />} /> {/* Use the defined component */}
            <Route path="/admin/reservations" element={<AdminReservations />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            {/* Redirect other paths */}
            <Route path="*" element={<Navigate to="/" replace />} /> 
          </Routes>
        ) : ( 
          // Regular User Routes
          <Routes>
            <Route 
              path='/' 
              element={<HomePage 
                setShowFeedback={setShowFeedback} 
                openPanel={() => setShowAllFeedbackPanel(true)} 
              />} 
            />
            <Route path='/my-reservations' element={<MyReservations />} />
             {/* Redirect other paths */}
            <Route path="*" element={<Navigate to="/" replace />} /> 
          </Routes>
        )}
      </main>
    </>
  );
}

export default App;