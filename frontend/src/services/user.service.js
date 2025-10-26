import {api} from "../api.js";

export const getMe = async () => {
    try {
        const response = await api.get("/users/me");
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

/**
 * Update current user profile information
 * @param data (name, email, password)
 * @returns {Promise<any>}
 */
export const updateMe = async (data) => {
    try {
        const response = await api.put("/users/me", data);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};


/**
 * Disable current user account (soft delete)
 * @returns {Promise<any>}
 */
export const disableMe = async () => {
    try {
        const response = await api.delete("/users/disable/me");
        return response.data;
    } catch (e) {
        console.error(e);
    }
};


