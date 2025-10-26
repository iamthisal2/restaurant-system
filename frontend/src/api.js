import axios from "axios";
import {LOCAL_AUTH_TOKEN_KEY} from "./Context/AuthContext.jsx";

export const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(LOCAL_AUTH_TOKEN_KEY);
        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// GET USER
export const getUser = (id, loggedInUserId) =>
    api.get(`/users/${id}?loggedInUserId=${loggedInUserId}`);

export const updateUser = (id, loggedInUserId, data) =>
    api.put(`/users/${id}?loggedInUserId=${loggedInUserId}`, data);

export const deleteUser = (id, loggedInUserId) =>
    api.delete(`/users/${id}?loggedInUserId=${loggedInUserId}`);

// -------------------
// Foods CRUD
