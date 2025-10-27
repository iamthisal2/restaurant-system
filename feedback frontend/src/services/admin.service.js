import {api} from "../api.js";

export const createReservationByAdmin = async (reservationData) => {
    try {
        const response = await api.post("/admin/reservations", reservationData);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};


