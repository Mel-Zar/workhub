import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

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

    useEffect(() => {
        const initAuth = async () => {
            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken })
                });

                if (!res.ok) throw new Error("Refresh failed");

                const data = await res.json();
                localStorage.setItem("accessToken", data.accessToken);
                setUser(getUserFromToken(data.accessToken));
            } catch {
                localStorage.clear();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    function login(accessToken, refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setUser(getUserFromToken(accessToken));
    }

    function logout() {
        localStorage.clear();
        setUser(null);
        window.location.href = "/login";
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                loading,
                login,
                logout
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}
