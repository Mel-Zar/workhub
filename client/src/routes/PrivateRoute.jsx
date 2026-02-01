import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {

    const { isLoggedIn, loading } = useContext(AuthContext);

    if (loading) {
        return <p>Laddar...</p>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;
