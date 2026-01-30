// Navbar.js
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

function Navbar() {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav style={{ marginBottom: "20px" }}>
            <div>
                {isLoggedIn ? (
                    <>
                        <Link to="/">Home</Link> |{" "}
                        <Link to="/tasks">Tasks</Link> |{" "}
                        <Link to="/dashboard">Dashboard</Link> |{" "}
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
            </div>
        </nav>
    );
}

export default Navbar;
