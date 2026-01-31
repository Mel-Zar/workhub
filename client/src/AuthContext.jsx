import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ================= LOAD TOKENS FROM LOCALSTORAGE =================
    useEffect(() => {
        const a = localStorage.getItem("accessToken");
        const r = localStorage.getItem("refreshToken");
        if (a && r) {
            setAccessToken(a);
            setRefreshToken(r);
            setIsLoggedIn(true);
        }
    }, []);

    // ================= LOGIN =================
    const login = (access, refresh) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        setAccessToken(access);
        setRefreshToken(refresh);
        setIsLoggedIn(true);
    };

    // ================= LOGOUT =================
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAccessToken(null);
        setRefreshToken(null);
        setIsLoggedIn(false);
    };

    // ================= REFRESH TOKEN =================
    const refreshAccessToken = async () => {
        try {
            const r = localStorage.getItem("refreshToken");
            if (!r) throw new Error("No refresh token");

            const res = await fetch("http://localhost:5001/api/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: r })
            });

            if (!res.ok) throw new Error("Refresh failed");

            const data = await res.json();
            localStorage.setItem("accessToken", data.accessToken);
            setAccessToken(data.accessToken);

            return data.accessToken;
        } catch (err) {
            console.log("Refresh token expired");
            logout();
            return null;
        }
    };

    // ================= GET VALID ACCESS TOKEN =================
    const getValidAccessToken = async () => {
        // 1️⃣ state
        if (accessToken) return accessToken;

        // 2️⃣ localStorage fallback
        const storedAccess = localStorage.getItem("accessToken");
        if (storedAccess) return storedAccess;

        // 3️⃣ refresh
        return await refreshAccessToken();
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            accessToken,
            login,
            logout,
            getValidAccessToken
        }}>
            {children}
        </AuthContext.Provider>
    );
}
