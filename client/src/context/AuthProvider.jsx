import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);

    // ================= INIT =================
    useEffect(() => {
        const initAuth = () => {
            const access = localStorage.getItem("accessToken");
            const refresh = localStorage.getItem("refreshToken");

            if (access && refresh) {
                try {
                    const payload = JSON.parse(atob(access.split(".")[1]));
                    const name = payload.name || "User";

                    // Sätt state asynkront för att undvika cascading renders
                    setTimeout(() => {
                        setUserName(name);
                        setIsLoggedIn(true);
                        setLoading(false);
                    }, 0);
                } catch (err) {
                    console.error("Invalid token", err);
                    setTimeout(() => {
                        setUserName(null);
                        setIsLoggedIn(false);
                        setLoading(false);
                    }, 0);
                }
            } else {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // ================= LOGIN =================
    function login(access, refresh) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);

        try {
            const payload = JSON.parse(atob(access.split(".")[1]));
            const name = payload.name || "User";
            setUserName(name);
            setIsLoggedIn(true);
        } catch {
            setUserName("User");
            setIsLoggedIn(true);
        }
    }

    // ================= LOGOUT =================
    function logout() {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserName(null);
        window.location.href = "/login";
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, userName, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
