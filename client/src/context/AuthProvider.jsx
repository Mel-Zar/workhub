import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);

    // ================= INIT =================
    useEffect(() => {
        const access = localStorage.getItem("accessToken");
        if (!access) {
            setLoading(false);
            return;
        }

        try {
            const payload = JSON.parse(atob(access.split(".")[1]));
            setUserName(payload.name || "User");
            setIsLoggedIn(true);
        } catch (err) {
            console.error("Invalid token", err);
            setUserName("");
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    }, []);

    // ================= LOGIN =================
    function login(access, refresh) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);

        try {
            const payload = JSON.parse(atob(access.split(".")[1]));
            setUserName(payload.name || "User");
            setIsLoggedIn(true);
        } catch {
            setUserName("User");
            setIsLoggedIn(true);
        }
    }

    // ================= LOGOUT =================
    function logout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        setUserName("");
        window.location.href = "/login";
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, userName, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
