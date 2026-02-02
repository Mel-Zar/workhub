import { useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const access = localStorage.getItem("accessToken");
        const refresh = localStorage.getItem("refreshToken");
        return !!(access && refresh);
    });

    const [loading] = useState(false);

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
