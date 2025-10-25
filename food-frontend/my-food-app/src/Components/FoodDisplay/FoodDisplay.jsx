// src/Components/FoodDisplay/FoodDisplay.jsx
import React, { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext"; // Correct path
import FoodItem from "../FoodItem/FoodItem"; // Correct path
import "./FoodDisplay.css";

const FoodDisplay = () => {
  const { foods } = useContext(StoreContext);

  return (
    <div className="food-display">
      <h2>Top Dishes</h2>
      <div className="food-display-list">
        {foods
          .filter((food) => food.visible !== false)
          .map((food) => (
            <FoodItem key={food.id} food={food} />
          ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
