import {api} from "../api.js";

export const getMyCart = async () => {
    try {
        const response = await api.get("/cart/me");
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const addItemToCart = async (foodId, quantity) => {
    try {
        const response = await api.post(`/cart/add`, null, { params: { foodId, quantity } });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const removeItemFromCart = async (cartItemId) => {
    try {
        const response = await api.delete(`/cart/remove/${cartItemId}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const clearCart = async () => {
    try {
        const response = await api.delete(`/cart/clear`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};


