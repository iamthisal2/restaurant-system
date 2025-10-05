import React from 'react';
import ReactDOM from 'react-dom/client'; // Corrected import
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Use the imported ReactDOM object here
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);