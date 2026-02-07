import { request } from "../api/request";

export const authService = {
    login: async credentials => {
        const data = await request("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials)
        });

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        return data;
    },

    register: user =>
        request("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(user)
        }),

    updateProfile: data =>
        request("/api/auth/profile", {
            method: "PUT",
            body: JSON.stringify(data)
        }),

    deleteAccount: currentPassword =>
        request("/api/auth/delete", {
            method: "DELETE",
            body: JSON.stringify({ currentPassword })
        }),

    logout: async () => {
        try {
            await request("/api/auth/logout", { method: "POST" });
        } finally {
            localStorage.clear();
        }
    }
};
