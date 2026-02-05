import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/authService";

function Login() {
  const { login, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard");
  }, [isLoggedIn, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔑 Login via authService
      const data = await authService.login({ email, password });

      // Uppdatera context med tokens
      login(data.accessToken, data.refreshToken);

      toast.success(`Välkommen tillbaka ${data.user.name}!`);
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Fel email eller lösenord");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Logga in</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? "Loggar in..." : "Logga in"}
        </button>
      </form>
    </div>
  );
}

export default Login;
