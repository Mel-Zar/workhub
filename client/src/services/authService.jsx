import { apiFetch } from "../api/ApiFetch";

export const authService = {

    // ================= LOGIN =================
    async login(credentials) {
        const res = await apiFetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        return data;
    },

    // ================= REGISTER =================
    async register(user) {
        const res = await apiFetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(user)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Register failed");

        return data;
    },

    // ================= UPDATE PROFILE =================
    async updateProfile({ name, email, currentPassword, newPassword }) {
        const res = await apiFetch("/api/auth/profile", {
            method: "PUT",
            body: JSON.stringify({ name, email, currentPassword, newPassword })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Profile update failed");

        return data;
    },

    // ================= DELETE ACCOUNT =================
    async deleteAccount(currentPassword) {
        const res = await apiFetch("/api/auth/delete", {
            method: "DELETE",
            body: JSON.stringify({ currentPassword })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Delete account failed");

        return data;
    }

};
