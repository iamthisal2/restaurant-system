import axios from "axios";
import {LOCAL_AUTH_TOKEN_KEY} from "./Context/AuthContext.jsx";

export const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(LOCAL_AUTH_TOKEN_KEY); // or wherever you store it
        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export const getUser = (id, loggedInUserId) =>
    api.get(`/users/${id}?loggedInUserId=${loggedInUserId}`);



