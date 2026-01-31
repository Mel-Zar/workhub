import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

function PrivateRoute({ children }) {

    const { accessToken } = useContext(AuthContext);

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;
