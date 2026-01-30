import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    console.log("Skickar register till backend:", { name, email, password });

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("Register response från backend:", data);

      if (!res.ok) {
        setError(data.message || data.error || "Registrering misslyckades");
        return;
      }

      if (data.accessToken) {
        login(data.accessToken); // logga in direkt
        navigate("/dashboard");           // navigera till dashoard
      } else {
        navigate("/login");      // annars till login
      }
    } catch (err) {
      console.log("Network error:", err);
      setError("Kan inte kontakta servern");
    }
  }

  return (
    <div>
      <h2>Registrera</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Namn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button type="submit">Registrera</button>
      </form>
    </div>
  );
}

export default Register;
