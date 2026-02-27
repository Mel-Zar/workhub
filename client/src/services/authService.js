import { apiFetch } from "../api/apiFetch";

export const authService = {
    login: async (credentials) => {
        return apiFetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
    },

    register: async (user) => {
        return apiFetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
    },

    updateProfile: async (data) => {
        return apiFetch("/api/auth/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    },

    deleteAccount: async (currentPassword) => {
        return apiFetch("/api/auth/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword }),
        });
    },

    logout: async (refreshToken) => {
        return apiFetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });
    },

    refresh: async (refreshToken) => {
        return apiFetch("/api/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });
    },
};
