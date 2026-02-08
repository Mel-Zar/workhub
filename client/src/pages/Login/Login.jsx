import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { authService } from "../../services/authService";

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
        email: email.trim().toLowerCase(), // alltid små bokstäver
        password
      });

      login(data.accessToken, data.refreshToken);
      toast.success(`Välkommen tillbaka ${data.user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Fel email eller lösenord");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Logga in</h2>
      <form style={{ display: "flex", flexDirection: "column", gap: 10 }} onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())} // alltid små bokstäver
          required
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />{" "}
          Visa lösenord
        </label>

        <button disabled={loading}>
          {loading ? "Loggar in..." : "Logga in"}
        </button>
      </form>
    </div>
  );
}

export default Login;
