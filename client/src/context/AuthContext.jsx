import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const a = localStorage.getItem("accessToken");
        const r = localStorage.getItem("refreshToken");

        if (a && r) {
            setIsLoggedIn(true);
        }

        setLoading(false);
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
        <AuthContext.Provider value={{
            isLoggedIn,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}
