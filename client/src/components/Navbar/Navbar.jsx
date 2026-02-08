import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav style={{ marginBottom: "20px" }}>
            {isLoggedIn && <p>Hej, <strong>{user?.name}</strong> 👋</p>}

            {isLoggedIn ? (
                <>
                    <Link to="/">Home</Link> |{" "}
                    <Link to="/tasks">Tasks</Link> |{" "}
                    <Link to="/dashboard">Dashboard</Link> |{" "}
                    <Link to="/profile">Profile</Link> |{" "}
                    <button onClick={handleLogout} style={{ cursor: "pointer" }}>
                        Logga ut
                    </button>
                </>
            ) : (
                <>
                    <Link to="/">Home</Link> |{" "}
                    <Link to="/register">Register</Link> |{" "}
                    <Link to="/login">Login</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;
