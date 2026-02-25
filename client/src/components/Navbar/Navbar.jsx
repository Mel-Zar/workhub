import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import logo from "../../assets/workhub-logo.png";
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
                <Link to="/">
                    <img src={logo} alt="Workhub logo" />
                </Link>
            </div>

            <button
                className={`burger ${open ? "active" : ""}`}
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Overlay bakom menyn */}
            <div
                className={`menu-overlay ${open ? "active" : ""}`}
                onClick={() => setOpen(false)}
            />

            <nav className={`menu ${open ? "open" : ""}`}>
                {isLoggedIn && (
                    <span className="user">
                        Welcome,{" "}
                        <Link
                            to="/profile"
                            className="username"
                            onClick={() => setOpen(false)}
                        >
                            {user?.name}
                        </Link>
                    </span>
                )}

                {isLoggedIn ? (
                    <>
                        <Link to="/" onClick={() => setOpen(false)}>Overview</Link>
                        <Link to="/tasks" onClick={() => setOpen(false)}>Tasks</Link>
                        <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                        <Link to="/profile" onClick={() => setOpen(false)}>Account</Link>

                        <button
                            className={`theme-toggle ${theme === "dark" ? "dark" : ""}`}
                            onClick={toggleTheme}
                            title="Toggle theme"
                        >
                            <div className="toggle-track">
                                <div className="toggle-thumb">
                                    <span className="icon sun">☀</span>
                                    <span className="icon moon">🌙</span>
                                </div>
                            </div>
                        </button>

                        <button className="logout" onClick={handleLogout}>
                            Sign out
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={`theme-toggle ${theme === "dark" ? "dark" : ""}`}
                            onClick={toggleTheme}
                            title="Toggle theme"
                        >
                            <div className="toggle-track">
                                <div className="toggle-thumb">
                                    <span className="icon sun">☀</span>
                                    <span className="icon moon">🌙</span>
                                </div>
                            </div>
                        </button>

                        <Link to="/register" onClick={() => setOpen(false)}>Create account</Link>
                        <Link to="/login" onClick={() => setOpen(false)}>Sign in</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Navbar;
