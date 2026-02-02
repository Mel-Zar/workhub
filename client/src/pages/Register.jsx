import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registrering misslyckades");
        return;
      }

      setSuccess("Konto skapat! Skickar dig till inloggning...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      console.error("Register error:", err);
      setError("Kan inte kontakta servern");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Registrera</h2>

      {loading && <p>Laddar...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>

        <input type="text" placeholder="Namn"
          value={name} onChange={e => setName(e.target.value)} required />

        <input type="email" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)} required />

        <input type="password" placeholder="Lösenord"
          value={password} onChange={e => setPassword(e.target.value)} required />

        <button type="submit" disabled={loading}>Registrera</button>

      </form>
    </div>
  );
}

export default Register;
