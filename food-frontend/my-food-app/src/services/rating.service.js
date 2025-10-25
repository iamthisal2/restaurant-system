import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const addRating = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/ratings`, data);
        return response.data;
    } catch (e) {
        console.error('Error adding rating:', e);
        throw e;
    }
};

export const getAllRatingsForFood = async (foodId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ratings/food/${foodId}`);
        return response.data;
    } catch (e) {
        console.error('Error fetching ratings for food:', e);
        throw e;
    }
};

export const getFoodAverageRating = async (foodId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ratings/food/${foodId}/average`);
        return response.data;
    } catch (e) {
        console.error('Error fetching average rating:', e);
        throw e;
    }
};

export const deleteRating = async (ratingId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/ratings/${ratingId}`);
        return response.data;
    } catch (e) {
        console.error('Error deleting rating:', e);
        throw e;
    }
};

export const getAllRatings = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ratings`);
        return response.data;
    } catch (e) {
        console.error('Error fetching all ratings:', e);
        throw e;
    }
};
