import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const a = localStorage.getItem("accessToken");
        const r = localStorage.getItem("refreshToken");
        if (a && r) setIsLoggedIn(true);
    }, []);

    const login = (access, refresh) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
