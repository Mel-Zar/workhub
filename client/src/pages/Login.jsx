import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../api/ApiFetch";

function Login() {

  const { login, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accessToken) navigate("/dashboard");
  }, [accessToken, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Fel email eller lösenord");
        return;
      }

      login(data.accessToken, data.refreshToken);
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Serverfel");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Logga in</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}>

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
