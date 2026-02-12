import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { authService } from "../../services/authService";
import "./Login.scss";

function Login() {
  const { login, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard");
  }, [isLoggedIn, navigate]);


  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.login({
        email: email.trim().toLowerCase(),
        password
      });

      login(data.accessToken, data.refreshToken);
      toast.success(`Welcome back ${data.user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-container">
        <article className="login-card">

          {/* HEADER */}
          <header className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue organizing your tasks</p>
          </header>

          {/* FORM */}
          <form className="login-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="password-toggle">
              <input
                id="showPassword"
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword">Show password</label>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          {/* FOOTER */}
          <footer className="login-footer">
            <p>
              Don't have an account?{" "}
              <span
                role="button"
                tabIndex={0}
                onClick={() => navigate("/register")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/register")}
              >
                Create account
              </span>
            </p>
          </footer>

        </article>
      </section>
    </main>

  );
}

export default Login;
