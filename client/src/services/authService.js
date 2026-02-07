import { request } from "../api/request";

export const authService = {

    // ================= LOGIN =================
    async login(credentials) {
        const data = await request("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials)
        });

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        return data;
    },

    // ================= REGISTER =================
    async register(user) {
        return request("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(user)
        });
    },

    // ================= REFRESH ACCESS TOKEN =================
    async refresh() {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const data = await request("/api/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refreshToken })
        });

        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
    },

    // ================= UPDATE PROFILE =================
    async updateProfile({ name, email, currentPassword, newPassword }) {
        return request("/api/auth/profile", {
            method: "PUT",
            body: JSON.stringify({
                name,
                email,
                currentPassword,
                newPassword
            })
        });
    },

    // ================= DELETE ACCOUNT =================
    async deleteAccount(currentPassword) {
        return request("/api/auth/delete", {
            method: "DELETE",
            body: JSON.stringify({ currentPassword })
        });
    },

    // ================= LOGOUT =================
    async logout() {
        try {
            await request("/api/auth/logout", { method: "POST" });
        } catch {
            // ignore backend logout errors
        }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
};
