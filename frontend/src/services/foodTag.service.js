import {api} from "../api.js";

export const addFoodTag = async (data) => {
    try {
        const response = await api.post("/users/food-tags", data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getFoodTagsForUser = async (userId) => {
    try {
        const response = await api.get(`/users/food-tags/${userId}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const updateFoodTag = async (foodId, data) => {
    try {
        const response = await api.put(`/users/food-tags/${foodId}`, data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const deleteFoodTag = async (foodId) => {
    try {
        const response = await api.delete(`/users/food-tags/${foodId}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};


