import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // Om redan inloggad → dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Inloggning misslyckades");
        return;
      }

      if (!data.accessToken || !data.refreshToken) {
        setError("Servern skickade inte tokens korrekt");
        return;
      }

      // Spara tokens
      login(data.accessToken, data.refreshToken);

      // Gå till dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      setError("Kan inte kontakta servern");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Logga in</h2>

      {loading && <p>Laddar...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button type="submit" disabled={loading}>
          Logga in
        </button>

      </form>
    </div>
  );
}

export default Login;
