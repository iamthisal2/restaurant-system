// src/admin/FoodForm.jsx
import React, { useState, useEffect } from 'react';
import './FoodForm.css';

const FoodForm = ({ food, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name,
        price: food.price,
        description: food.description,
        category: food.category
      });
    }
  }, [food]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const foodData = {
      ...formData,
      price: parseFloat(formData.price)
    };
    
    if (food) {
      onSubmit(food.id, foodData);
    } else {
      onSubmit(foodData);
    }
  };

  const categories = ['Burgers', 'Submarines', 'Soups & Salads', 'Pasta', 'Bites', 
                     'Kottu', 'Noodles', 'Fried Rice', 'Mongolian Rice', 
                     'Nasi Goreng', 'Chopsuey Rice', 'Beverages'];

  return (
    <div className="food-form-overlay">
      <div className="food-form">
        <h2>{food ? 'Edit Food' : 'Add New Food'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price (Rs):</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {food ? 'Update' : 'Add'} Food
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodForm;