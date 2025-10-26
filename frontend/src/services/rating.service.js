import {api} from "../api.js";

export const addOrUpdateRating = async (data) => {
    try {
        const response = await api.post("/ratings", data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getUserRatingForFood = async (userId, foodId) => {
    try {
        const response = await api.get(`/ratings/user/${userId}/food/${foodId}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getUserRatings = async (userId) => {
    try {
        const response = await api.get(`/ratings/user/${userId}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getAllRatingsForFood = async (foodId) => {
    try {
        const response = await api.get(`/ratings/food/${foodId}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getFoodAverageRating = async (foodId) => {
    try {
        const response = await api.get(`/ratings/food/${foodId}/average`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const deleteRating = async (userId, foodId) => {
    try {
        const response = await api.delete(`/ratings/user/${userId}/food/${foodId}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getAllRatings = async () => {
    try {
        const response = await api.get("/ratings");
        return response.data;
    } catch (e) {
        console.error(e);
    }
};


