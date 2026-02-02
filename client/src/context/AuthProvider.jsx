import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = () => {
            const a = localStorage.getItem("accessToken");
            const r = localStorage.getItem("refreshToken");

            if (a && r) setIsLoggedIn(true);
            setLoading(false);
        };

        // Kör efter mount för att undvika cascading renders
        setTimeout(initializeAuth, 0);
    }, []);

    function login(access, refresh) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        setIsLoggedIn(true);
    }

    function logout() {
        localStorage.clear();
        setIsLoggedIn(false);
        window.location.href = "/login";
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
