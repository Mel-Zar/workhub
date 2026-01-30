import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function PrivateRoute({ children }) {
    const { isLoggedIn } = useContext(AuthContext);

    // Om inte inloggad, skicka till login
    if (!isLoggedIn) return <Navigate to="/login" />;

    return children;
}

export default PrivateRoute;
