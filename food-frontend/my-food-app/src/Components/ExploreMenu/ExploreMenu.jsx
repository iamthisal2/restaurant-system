// src/Components/ExploreMenu/ExploreMenu.jsx
import React, { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext"; // Correct path
import "./ExploreMenu.css";

const ExploreMenu = () => {
  const { foods, updateFoodsVisibility } = useContext(StoreContext);

  // Get unique categories
  const categories = [...new Set(foods.map((item) => item.category))];

  const handleCategoryClick = (category) => {
    updateFoodsVisibility(category);
  };

  const showAll = () => {
    updateFoodsVisibility('all');
  };

  return (
    <div className="explore-menu">
      <h2>Explore Our Menu</h2>
      <div className="explore-menu-list">
        <button onClick={showAll} className="active">All</button>
        {categories.map((cat, idx) => (
          <button key={idx} onClick={() => handleCategoryClick(cat)}>
            {cat}
          </button>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;