import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard");
  }, [isLoggedIn, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Inloggning misslyckades");
        return;
      }

      if (!data.accessToken || !data.refreshToken || !data.name) {
        toast.error("Servern skickade fel data");
        return;
      }

      login(data.accessToken, data.refreshToken, data.name);

      toast.success("Inloggad!");
      navigate("/dashboard");

    } catch {
      toast.error("Kan inte kontakta servern");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Logga in</h2>

      <form onSubmit={handleSubmit}>

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
