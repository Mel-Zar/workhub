import { useState } from "react";
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

function getInitialUser() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return null;
    return getUserFromToken(accessToken);
}

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(getInitialUser);
    const [loading] = useState(false); // inget async → alltid false

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

    function updateUserName(name) {
        setUser(prev => (prev ? { ...prev, name } : prev));
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                loading,
                login,
                logout,
                updateUserName
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
