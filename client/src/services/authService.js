import { apiFetch } from "../api/apiFetch";

export const authService = {
    login: async (credentials) => {
        const data = await apiFetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });



        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        return data;
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

    logout: async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");

            await apiFetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            });
        } finally {
            localStorage.clear();
            window.location.href = "/login";
        }
    },
};
