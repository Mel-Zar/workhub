import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import "./Navbar.scss";

function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
        setOpen(false);
    };

    return (
        <header className="navbar">
            <div className="brand">
                <span>WorkHub</span>
            </div>

            <button className="burger" onClick={() => setOpen(!open)}>
                ☰
            </button>

            <nav className={`menu ${open ? "open" : ""}`}>
                {isLoggedIn && (
                    <span className="user">
                        Welcome, <strong>{user?.name}</strong>
                    </span>
                )}

                {isLoggedIn ? (
                    <>
                        <Link to="/" onClick={() => setOpen(false)}>Overview</Link>
                        <Link to="/tasks" onClick={() => setOpen(false)}>My Tasks</Link>
                        <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                        <Link to="/profile" onClick={() => setOpen(false)}>Account</Link>

                        <button
                            className="icon-btn"
                            onClick={toggleTheme}
                            title="Toggle theme"
                        >
                            {theme === "light" ? "🌙" : "☀️"}
                        </button>

                        <button className="logout" onClick={handleLogout}>
                            Sign out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/register">Create account</Link>
                        <Link to="/login">Sign in</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Navbar;
