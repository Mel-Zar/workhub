import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const initializeAuth = () => {

            const a = localStorage.getItem("accessToken");
            const r = localStorage.getItem("refreshToken");
            const n = localStorage.getItem("userName");

            if (a && r && n) {
                setUserName(n);
                setIsLoggedIn(true);
            }

            setLoading(false);
        };

        setTimeout(initializeAuth, 0);

    }, []);

    // ✅ TAR EMOT name
    function login(access, refresh, name) {

        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("userName", name);

        setUserName(name);
        setIsLoggedIn(true);
    }

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
