import {api} from "../api.js";

export const getMe = async () => {
    try {
        const response = await api.get("/users/me");
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const updateMe = async (data) => {
    try {
        const response = await api.put("/users/me", data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const disableMe = async () => {
    try {
        const response = await api.delete("/users/disable/me");
        return response.data;
    } catch (e) {
        console.error(e);
    }
};


