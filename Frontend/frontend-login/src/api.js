import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/users",
});

// REGISTER
export const registerUser = (data) => API.post("/register", data);

// LOGIN
export const loginUser = (data) => API.post("/login", data);

// GET USER
export const getUser = (id, loggedInUserId) =>
  API.get(`/${id}?loggedInUserId=${loggedInUserId}`);

// UPDATE USER
export const updateUser = (id, loggedInUserId, data) =>
  API.put(`/${id}?loggedInUserId=${loggedInUserId}`, data);

// DELETE USER
export const deleteUser = (id, loggedInUserId) =>
  API.delete(`/${id}?loggedInUserId=${loggedInUserId}`);

// -------------------
// FoodTags CRUD
export const getFoodTags = (userId) => API.get(`/food-tags?userId=${userId}`);
export const addFoodTag = (data) => API.post(`/food-tags`, data);
export const updateFoodTag = (id, data) => API.put(`/food-tags/${id}`, data);
export const deleteFoodTag = (id) => API.delete(`/food-tags/${id}`);
