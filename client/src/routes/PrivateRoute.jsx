import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

function PrivateRoute({ children }) {

    const { isLoggedIn } = useContext(AuthContext);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;
