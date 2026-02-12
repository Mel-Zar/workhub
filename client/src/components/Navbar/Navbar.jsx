import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import "./Navbar.scss";

function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate("/login");
        setOpen(false);
    };

    // Klick utanför stänger menyn
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <header className="navbar" ref={menuRef}>
            <div className="brand">
                <Link to="/"><span>WorkHub</span></Link>
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
                        <button
                            className="icon-btn"
                            onClick={toggleTheme}
                            title="Toggle theme"
                        >
                            {theme === "light" ? "🌙" : "☀️"}
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
