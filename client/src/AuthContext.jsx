import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {

    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ================= LOAD TOKENS =================
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

    // ================= REFRESH ACCESS TOKEN =================
    const refreshAccessToken = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error("Refresh failed");

            localStorage.setItem("accessToken", data.accessToken);
            setAccessToken(data.accessToken);

            return data.accessToken;
        } catch (err) {
            console.log("Refresh token expired");
            logout();
            return null;
        }
    };

    // ================= GET VALID TOKEN =================
    const getValidAccessToken = async () => {

        if (accessToken) return accessToken;

        if (refreshToken) {
            return await refreshAccessToken();
        }

        return null;
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                accessToken,
                login,
                logout,
                refreshAccessToken,
                getValidAccessToken   // 👈 VIKTIG
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider };
