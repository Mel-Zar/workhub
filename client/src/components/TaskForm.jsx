import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

function TaskForm({ onCreate }) {

    const { getValidAccessToken, logout } = useContext(AuthContext);

    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("medium");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");
    const [error, setError] = useState("");

    // ================= FORMAT INPUT =================
    function formatInput(value, maxLength = 40) {
        let v = value;

        // Ta bort specialtecken
        v = v.replace(/[^a-zA-ZåäöÅÄÖ0-9 ]/g, "");

        // Ta bort dubbla mellanslag
        v = v.replace(/\s+/g, " ");

        // Trimma
        v = v.trimStart();

        // Första bokstaven stor
        if (v.length > 0) {
            v = v.charAt(0).toUpperCase() + v.slice(1);
        }

        // Maxlängd
        return v.slice(0, maxLength);
    }

    // helper
    function formatCategory(value) {
        let v = value.replace(/[^A-Za-zÅÄÖåäö]/g, ""); // bara bokstäver
        v = v.slice(0, 20); // max 20 tecken

        if (v.length === 0) return "";

        return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
    }

    // ================= SUBMIT =================
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!title.trim()) return;

        try {
            const token = await getValidAccessToken();
            if (!token) {
                logout();
                return;
            }

            const res = await fetch("http://localhost:5001/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    priority,
                    category,
                    deadline
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Kunde inte skapa task");
                return;
            }

            onCreate(data);

            setTitle("");
            setCategory("");
            setDeadline("");
            setPriority("medium");

        } catch (err) {
            console.error(err);
            setError("Serverfel");
        }
    }

    return (
        <form onSubmit={handleSubmit}>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* TITEL */}
            <input
                placeholder="Titel"
                value={title}
                maxLength={40}
                onChange={e => setTitle(formatInput(e.target.value, 40))}
                required
            />

            {/* PRIORITY */}
            <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            {/* KATEGORI */}
            <input
                placeholder="Kategori"
                value={category}
                onChange={(e) => setCategory(formatCategory(e.target.value))}
                maxLength={20}
            />


            {/* DEADLINE */}
            <input
                type="date"
                value={deadline}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setDeadline(e.target.value)}
            />

            <button>Skapa</button>

        </form>
    );
}

export default TaskForm;
