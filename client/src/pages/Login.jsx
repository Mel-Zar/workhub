import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Om redan inloggad, skicka direkt till Home
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("useEffect, token:", token);
    if (token) navigate("/dashboard");
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    console.log("Skickar till backend:", { email, password });

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Fetch status:", res.status, res.ok);
      const data = await res.json();
      console.log("Login response från backend:", data);

      if (!res.ok) {
        setError(data.message || data.error || "Inloggning misslyckades");
        return;
      }

      if (data.accessToken) {
        login(data.accessToken); // sparar token i Context + localStorage
        navigate("/dashboard");           // navigerar direkt till Home
      }
    } catch (err) {
      console.log("Network error:", err);
      setError("Kan inte kontakta servern");
    }
  }

  return (
    <div>
      <h2>Logga in</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Logga in</button>
      </form>
    </div>
  );
}

export default Login;
