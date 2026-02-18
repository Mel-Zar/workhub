import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext/AuthContext";

export default function PrivateRoute({ children }) {

    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>Laddar...</p>;

    if (!user) return <Navigate to="/login" replace />;

    return children;
}