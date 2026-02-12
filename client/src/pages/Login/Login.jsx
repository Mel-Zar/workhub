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
      <div className="login-container">

        <div className="login-card">

          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue organizing your tasks</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="password-toggle">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span>Show password</span>
            </div>

            <button className="login-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")}>
                Create account
              </span>
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}

export default Login;
