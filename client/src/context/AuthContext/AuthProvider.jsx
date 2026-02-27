import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";


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
    const navigate = useNavigate();

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
                const data = await authService.refresh(refreshToken);

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
        navigate("/login", { replace: true });
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
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
