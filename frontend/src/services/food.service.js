import {api} from "../api.js";

export const createFood = async (data) => {
    try {
        const response = await api.post("/foods", data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getAllFoods = async () => {
    try {
        const response = await api.get("/foods");
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getFoodById = async (foodId) => {
    try {
        const response = await api.get(`/foods/${foodId}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const updateFood = async (foodId, data) => {
    try {
        const response = await api.put(`/foods/${foodId}`, data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const deleteFood = async (id) => {
    try {
        const response = await api.delete(`/foods/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};


