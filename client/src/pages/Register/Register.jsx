import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services/authService";
import "./Register.scss";

function capitalizeFirst(value) {
  if (!value) return "";
  const [first, ...rest] = value;
  return first.toUpperCase() + rest.join("").toLowerCase();
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register({
        name: capitalizeFirst(name),
        email,
        password,
      });

      toast.success("Account created! Please sign in 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <div className="register-container">

        <div className="register-card">

          <div className="register-header">
            <h1>Create Account</h1>
            <p>Start organizing your tasks professionally</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Name</label>
              <input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(capitalizeFirst(e.target.value))}
                required
              />
            </div>

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

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

            </div>

            <button className="register-button" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </button>

          </form>

          <div className="register-footer">
            <p>
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>
                Sign in
              </span>
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}

export default Register;
