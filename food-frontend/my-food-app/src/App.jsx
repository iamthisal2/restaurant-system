// src/App.jsx
import React, { useState } from 'react';
import { StoreProvider } from "./Context/StoreContext";
import ExploreMenu from "./Components/ExploreMenu/ExploreMenu";
import FoodDisplay from "./Components/FoodDisplay/FoodDisplay";
import AdminPanel from './admin/AdminPanel';
import "./App.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <StoreProvider>
      <div className="App">
        {isAdmin ? (
          <AdminPanel />
        ) : (
          <>
            <div className="header">
              <h1>Crave Restaurant</h1>
              <p>Discover the finest flavors in town</p>
              <button 
                className="admin-toggle"
                onClick={() => setIsAdmin(true)}
              >
                Admin Mode
              </button>
            </div>
            <ExploreMenu />
            <FoodDisplay />
          </>
        )}
        
        {isAdmin && (
          <button 
            className="admin-toggle customer-mode"
            onClick={() => setIsAdmin(false)}
          >
            Customer Mode
          </button>
        )}
      </div>
    </StoreProvider>
  );
}

export default App;
