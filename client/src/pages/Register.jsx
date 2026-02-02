import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registrering misslyckades");
        return;
      }

      toast.success("Konto skapat!");
      setTimeout(() => navigate("/login"), 1000);

    } catch {
      toast.error("Kan inte kontakta servern");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Registrera</h2>

      <form onSubmit={handleSubmit}>

        <input placeholder="Namn" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Lösenord" value={password} onChange={e => setPassword(e.target.value)} required />

        <button disabled={loading}>
          {loading ? "Skapar konto..." : "Registrera"}
        </button>

      </form>
    </div>
  );
}

export default Register;
