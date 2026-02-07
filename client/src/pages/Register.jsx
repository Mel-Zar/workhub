import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../services/authService";

function capitalizeFirst(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
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
        email: capitalizeFirst(email),
        password
      });

      toast.success("Konto skapat! Logga in 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registrering misslyckades");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Registrera</h2>

      <form style={{ display: "flex", flexDirection: "column", gap: 10 }} onSubmit={handleSubmit}>
        <input
          placeholder="Namn"
          value={name}
          onChange={e => setName(capitalizeFirst(e.target.value))}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(capitalizeFirst(e.target.value))}
          required
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Lösenord"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          /> Visa lösenord
        </label>

        <button disabled={loading}>
          {loading ? "Skapar konto..." : "Registrera"}
        </button>
      </form>
    </div>
  );
}

export default Register;
