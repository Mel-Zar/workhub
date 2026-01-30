// AuthContext.js
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Kontrollera token när AuthProvider mountas
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
        console.log("AuthProvider mounted, isLoggedIn:", !!token);
    }, []);

    // Lyssna på förändringar i localStorage (andra flikar eller manuell borttagning)
    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        console.log("User logged in, token:", token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        console.log("User logged out");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };
