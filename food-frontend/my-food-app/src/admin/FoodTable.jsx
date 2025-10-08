// src/admin/FoodTable.jsx
import React from 'react';
import './FoodTable.css';

const FoodTable = ({ foods, onEdit, onDelete }) => {
  return (
    <div className="food-table">
      <h2>Food Items ({foods.length})</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price (Rs)</th>
            <th>Category</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {foods.map(food => (
            <tr key={food.id}>
              <td>{food.id}</td>
              <td>{food.name}</td>
              <td>{food.price}</td>
              <td>{food.category}</td>
              <td className="description-cell">{food.description}</td>
              <td className="actions-cell">
                <button 
                  className="btn-edit"
                  onClick={() => onEdit(food)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => onDelete(food.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodTable;