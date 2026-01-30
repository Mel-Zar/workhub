import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {

    const token = localStorage.getItem("token");

    // Om inget token → inte inloggad
    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default PrivateRoute;
