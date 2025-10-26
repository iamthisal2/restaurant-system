import {api} from "../api.js";


export const createReservation = async (data) => {
    try {
        const response = await api.post("/reservations", data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getAllReservations = async () => {
    try {
        const response = await api.get("/reservations");
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getMyReservations = async () => {
    try {
        const response = await api.get("/reservations/my-reservations");
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getReservationsForCustomer = async (customerId) => {
    try {
        const response = await api.get(`/reservations/customer/${customerId}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const deleteReservation = async (reservationId) => {
    try {
        const response = await api.delete(`/reservations/${reservationId}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getAvailableTimes = async (date, guests) => {
    try {
        const response = await api.get(`/reservations/available-times`, { params: { date, guests } });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const updateReservation = async (reservationId, data) => {
    try {
        const response = await api.put(`/reservations/${reservationId}`, data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const updateReservationStatus = async (id, status) => {
    try {
        const response = await api.patch(`/reservations/${id}/status`, { status });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getTables = async () => {
    try {
        const response = await api.get(`/reservations/tables`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

export const getAvailableTables = async (date, time, guests) => {
    try {
        const response = await api.get(`/reservations/available-tables?date=${date}&time=${time}&guests=${guests}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }

};


