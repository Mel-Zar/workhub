import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
    const { isLoggedIn, loading } = useContext(AuthContext);

    if (loading) return <p>Laddar...</p>; // Show loading while checking auth

    return isLoggedIn ? children : <Navigate to="/login" replace />;
}
