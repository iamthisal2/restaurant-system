// src/Components/FoodItem/FoodItem.jsx
import React from "react";
import "./FoodItem.css";

const FoodItem = ({ food }) => {
  return (
    <div className="food-item">
      <img src={food.image || "https://via.placeholder.com/200"} alt={food.name} />
      <h3>{food.name}</h3>
      <p>{food.description}</p>
      <span>Rs {food.price}</span>
    </div>
  );
};

export default FoodItem;
