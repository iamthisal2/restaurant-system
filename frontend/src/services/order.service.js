import {api} from "../api.js";

export const placeOrder = async (data) => {
    try {
        const response = await api.post("/orders/place", data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getUserOrders = async () => {
    try {
        const response = await api.get(`/orders/me`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await api.put(`/orders/${orderId}/status`, null, { params: { status } });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};


