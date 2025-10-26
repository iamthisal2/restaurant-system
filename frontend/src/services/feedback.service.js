import {api} from "../api.js";

export const createFeedback = async (data) => {
    try {
        const response = await api.post("/feedbacks", data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getAllFeedbacks = async () => {
    try {
        const response = await api.get("/feedbacks");
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getFeedbackById = async (feedbackId) => {
    try {
        const response = await api.get(`/feedbacks/${feedbackId}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const updateFeedback = async (feedBackId, data) => {
    try {
        const response = await api.put(`/feedbacks/${feedBackId}`, data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const deleteFeedback = async (feedBackId) => {
    try {
        const response = await api.delete(`/feedbacks/${feedBackId}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const addFeedbackResponse = async (feedbackId, data) => {
    try {
        const response = await api.post(`/feedbacks/${feedbackId}/response`, data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export const getUserFeedbacks = async () => {
    try {
        const response = await api.get("/feedbacks/me");
        return response.data;
    }
    catch (e) {
        console.error(e);
    }
}


