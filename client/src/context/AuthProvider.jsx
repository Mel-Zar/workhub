import { useState } from "react";
import { AuthContext } from "./AuthContext";

function getUserFromToken() {
    const access = localStorage.getItem("accessToken");
    if (!access) return null;

    try {
        const payload = JSON.parse(atob(access.split(".")[1]));
        return { name: payload.name };
    } catch {
        localStorage.clear();
        return null;
    }
}

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(() => getUserFromToken());
    const [loading] = useState(false);

    // ================= LOGIN =================
    function login(accessToken, refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        try {
            const payload = JSON.parse(atob(accessToken.split(".")[1]));
            setUser({ name: payload.name });
        } catch {
            setUser({ name: "User" });
        }
    }

    // ================= LOGOUT =================
    function logout() {
        localStorage.clear();
        setUser(null);
        window.location.href = "/login";
    }

    // ================= UPDATE USER NAME =================
    function updateUserName(name) {
        setUser(prev => ({ ...prev, name }));
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
