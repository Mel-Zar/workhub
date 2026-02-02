import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const { isLoggedIn, userName, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Visa inget om vi fortfarande laddar auth-state
    if (loading) return null;

    return (
        <nav style={{ marginBottom: "20px", padding: "10px 20px", borderBottom: "1px solid #ccc" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    {isLoggedIn && userName && (
                        <p style={{ margin: 0 }}>
                            Hej, välkommen <strong>{userName}</strong> 👋
                        </p>
                    )}
                </div>

                <div>
                    {isLoggedIn ? (
                        <>
                            <Link to="/" style={{ margin: "0 5px" }}>Home</Link>|
                            <Link to="/tasks" style={{ margin: "0 5px" }}>Tasks</Link>|
                            <Link to="/dashboard" style={{ margin: "0 5px" }}>Dashboard</Link>|
                            <Link to="/profile" style={{ margin: "0 5px" }}>Profile</Link>|
                            <button
                                onClick={handleLogout}
                                style={{ margin: "0 5px", cursor: "pointer" }}
                            >
                                Logga ut
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/" style={{ margin: "0 5px" }}>Home</Link>|
                            <Link to="/register" style={{ margin: "0 5px" }}>Register</Link>|
                            <Link to="/login" style={{ margin: "0 5px" }}>Login</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
