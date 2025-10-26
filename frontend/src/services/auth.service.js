import {api} from "../api.js";

/**
 * Register a new user
 * @param data (object) - User registration data
 * @returns {Promise<void>}
 */
export const registerUser = async (data) => {
    try {
        await api.post("/auth/register", data)
    }catch (e) {
        console.log(e);
    }
};

/**
 * (Login) Authenticate a user and retrieve a token
 * @param data
 * @returns {Promise<*>}
 */
export const logInUser = async (data) => {
    try {
        const response = await api.post("/auth/login", data);
        return response.data;
    } catch (err) {
        console.error("Login error:", err);
        // Return error response structure to match backend format
        return {
            success: false,
            message: err.response?.data?.message || "Login failed",
            data: null,
            status: err.response?.status || 500
        };
    }
}

