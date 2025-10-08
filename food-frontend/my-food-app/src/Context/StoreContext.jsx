// src/Context/StoreContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { foodImages } from "../Assets/assets"; // Import image mapping

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/foods");
        if (!response.ok) throw new Error('Failed to fetch foods');
        
        const data = await response.json();
        
        // 🔥 CRITICAL: Map backend data with frontend images
        const foodsWithImages = data.map(food => ({
          ...food,
          visible: true,
          image: foodImages[food.id] || foodImages[1] // Map image by ID
        }));
        
        setFoods(foodsWithImages);
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };

    fetchFoods();
  }, []);

  const updateFoodsVisibility = (category) => {
    setFoods(prevFoods => 
      prevFoods.map(food => ({
        ...food,
        visible: category === 'all' ? true : food.category === category
      }))
    );
  };

  return (
    <StoreContext.Provider value={{ foods, setFoods, updateFoodsVisibility }}>
      {children}
    </StoreContext.Provider>
  );
};
