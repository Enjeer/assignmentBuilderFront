import axios from "axios";
import { API_BASE_URL } from "@/config";

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.post(`${API_BASE_URL}token/refresh/`, {}, {
                    withCredentials: true
                });

                const newAccess = refreshResponse.data.access;

                localStorage.setItem("access_token", newAccess);

                originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("ab_user");
                window.location.href = "/auth";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);