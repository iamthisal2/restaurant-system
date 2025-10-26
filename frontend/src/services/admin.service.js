import {api} from "../api.js";

export const getAllUsersAdmin = async () => {
    try {
        const response = await api.get("/admin/users");
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const createUser = async (requestData) => {
    try {
        const response = await api.post("/admin/users/create", requestData);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const deleteUserAdmin = async (id) => {
    try {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getAllOrdersAdmin = async () => {
    try {
        const response = await api.get("/admin/orders");
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

export const updateUserAdmin = async (userId, data) => {
    try {
        const response = await api.put(`/admin/users/${userId}`, data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const disableUserAdmin = async (userId) => {
    try {
        const response = await api.put(`/admin/users/disable/${userId}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const updateOrderStatusAdmin = async (orderId, status) => {
    try {
        const response = await api.put(`/admin/orders/${orderId}/status`, null, { params: { status } });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const createReservationByAdmin = async (reservationData) => {
    try {
        const response = await api.post("/admin/reservations", reservationData);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};


