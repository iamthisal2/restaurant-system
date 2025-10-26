import React, { useState } from 'react';
import { useAdmin } from '../../Context/AdminContext';
import { showErrorToast } from '../../utils/toast.utils';
import {FoodCategories, getFoodImageUrl} from "../../utils/food.utils.js";



const FoodManagement = () => {
    const { foods, loading, createFood, updateFood, deleteFood, error, setError } = useAdmin();
    const [showModal, setShowModal] = useState(false);
    const [editingFood, setEditingFood] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        available: true
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Food name is required';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Food name must be at least 2 characters';
        }

        if (!formData.price || formData.price <= 0) {
            errors.price = 'Price must be greater than 0';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            if (editingFood) {
                await updateFood(editingFood.id, formData);
            } else {
                await createFood(formData);
            }
            setShowModal(false);
            setEditingFood(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                imageUrl: '',
                available: true
            });
            setFormErrors({});
        } catch (error) {
            console.error('Error saving food:', error);
            showErrorToast('Failed to save food item. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (food) => {
        setEditingFood(food);
        setFormData({
            name: food.name || '',
            description: food.description || '',
            price: food.price || '',
            category: food.category || '',
            imageUrl: food.imageUrl || '',
            available: food.available !== false
        });
        setShowModal(true);
    };

    const handleDelete = async (foodId) => {
        if (window.confirm('Are you sure you want to delete this food item?')) {
            try {
                await deleteFood(foodId);
            } catch (error) {
                console.error('Error deleting food:', error);
                showErrorToast('Failed to delete food item');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            imageUrl: '',
            available: true
        });
        setFormErrors({});
        setEditingFood(null);
        setShowModal(false);
        setError(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-end items-center">
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                        Total Items: {foods.length}
                    </div>
                    <button
                        onClick={() => {
                            setEditingFood(null);
                            setFormData({
                                name: '',
                                description: '',
                                price: '',
                                category: '',
                                imageUrl: '',
                                available: true
                            });
                            setShowModal(true);
                        }}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center space-x-2"
                    >
                        <span>Add Food Item</span>
                    </button>
                </div>
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {foods?.map((food) => (
                    <div key={food.id} className="bg-white rounded-lg shadow-soft border border-gray-200 overflow-hidden">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            {food?.category && (
                                <img
                                    src={getFoodImageUrl(food?.category)}
                                    alt={food.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{food.name}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{food.description}</p>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-lg font-bold text-orange-500">Rs. {food.price}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(food)}
                                    className="flex-1 border border-orange-500 text-orange-500 px-3 py-2 rounded-md text-sm hover:bg-secondary-600 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(food.id)}
                                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Food Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-100">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {editingFood ? 'Update food information' : 'Add a new item to the menu'}
                                </p>
                            </div>
                            <button
                                onClick={resetForm}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Food Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value });
                                            if (formErrors.name) {
                                                setFormErrors({ ...formErrors, name: '' });
                                            }
                                        }}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                                            formErrors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                        }`}
                                        placeholder="Enter food name"
                                        required
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        rows="3"
                                        placeholder="Enter food description"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs.</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => {
                                                setFormData({ ...formData, price: e.target.value });
                                                if (formErrors.price) {
                                                    setFormErrors({ ...formErrors, price: '' });
                                                }
                                            }}
                                            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                                                formErrors.price ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                                            }`}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    {formErrors.price && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    >
                                        <option value="">Select a category</option>
                                        {FoodCategories?.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </div>

                            {/* Modal Footer */}
                            <div className="flex space-x-3 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                                >
                                    {isSubmitting && (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    <span>
                                        {isSubmitting
                                            ? (editingFood ? 'Updating...' : 'Creating...')
                                            : (editingFood ? 'Update Food' : 'Create Food')
                                        }
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodManagement;