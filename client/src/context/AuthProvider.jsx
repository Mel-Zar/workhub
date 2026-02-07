import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/authService";

function getUserFromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
            id: payload.id,
            name: payload.name,
            email: payload.email
        };
    } catch {
        return null;
    }
}

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔁 SILENT REFRESH ON APP START
    useEffect(() => {
        const initAuth = async () => {
            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                setLoading(false);
                return;
            }

            try {
                const accessToken = await authService.refresh(refreshToken);
                const userFromToken = getUserFromToken(accessToken);
                setUser(userFromToken);
            } catch (err) {
                console.warn("🔐 Refresh failed, logging out", err);
                localStorage.clear();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // ================= LOGIN =================
    function login(accessToken, refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const userFromToken = getUserFromToken(accessToken);
        setUser(userFromToken);
    }

    // ================= LOGOUT =================
    function logout() {
        localStorage.clear();
        setUser(null);
        window.location.href = "/login";
    }

    // ================= UPDATE USER NAME =================
    function updateUserName(name) {
        setUser(prev => prev ? { ...prev, name } : prev);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                loading,
                login,
                logout,
                updateUserName
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}
