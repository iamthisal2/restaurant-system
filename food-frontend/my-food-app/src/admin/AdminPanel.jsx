// src/admin/AdminPanel.jsx
import React, { useState, useContext } from 'react';
import { StoreContext } from '../Context/StoreContext';
import FoodForm from './FoodForm';
import FoodTable from './FoodTable';
import RatingManagement from './RatingManagement';
import './AdminPanel.css';

const AdminPanel = () => {
  const { foods, setFoods } = useContext(StoreContext);
  const [editingFood, setEditingFood] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('foods'); // 'foods' or 'ratings'

  // Add new food
  const addFood = async (foodData) => {
    try {
      const response = await fetch('http://localhost:8080/api/foods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodData),
      });
      
      if (response.ok) {
        const newFood = await response.json();
        setFoods(prev => [...prev, { ...newFood, visible: true }]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  // Update food
  const updateFood = async (id, foodData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/foods/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodData),
      });
      
      if (response.ok) {
        const updatedFood = await response.json();
        setFoods(prev => prev.map(food => 
          food.id === id ? { ...updatedFood, visible: true } : food
        ));
        setEditingFood(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating food:', error);
    }
  };

  // Delete food
  const deleteFood = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/foods/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setFoods(prev => prev.filter(food => food.id !== id));
        }
      } catch (error) {
        console.error('Error deleting food:', error);
      }
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        {activeTab === 'foods' && (
          <button 
            className="btn-primary"
            onClick={() => {
              setEditingFood(null);
              setShowForm(true);
            }}
          >
            Add New Food
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'foods' ? 'active' : ''}`}
          onClick={() => setActiveTab('foods')}
        >
          <span className="tab-icon">🍽️</span>
          Food Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'ratings' ? 'active' : ''}`}
          onClick={() => setActiveTab('ratings')}
        >
          <span className="tab-icon">⭐</span>
          Rating Management
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'foods' && (
        <>
          {showForm && (
            <FoodForm
              food={editingFood}
              onSubmit={editingFood ? updateFood : addFood}
              onCancel={() => {
                setShowForm(false);
                setEditingFood(null);
              }}
            />
          )}

          <FoodTable
            foods={foods}
            onEdit={(food) => {
              setEditingFood(food);
              setShowForm(true);
            }}
            onDelete={deleteFood}
          />
        </>
      )}

      {activeTab === 'ratings' && (
        <RatingManagement />
      )}
    </div>
  );
};

export default AdminPanel;