import { useState } from "react";
import { apiFetch } from "../api/ApiFetch";

function TaskForm({ onCreate }) {

    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("medium");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");
    const [error, setError] = useState("");

    // ================= FORMAT INPUT =================
    function formatInput(value, maxLength = 40) {
        let v = value.replace(/[^a-zA-ZåäöÅÄÖ0-9 ]/g, "");
        v = v.replace(/\s+/g, " ");
        v = v.trimStart();

        if (v.length > 0)
            v = v.charAt(0).toUpperCase() + v.slice(1);

        return v.slice(0, maxLength);
    }

    function formatCategory(value) {
        let v = value.replace(/[^A-Za-zÅÄÖåäö]/g, "");
        v = v.slice(0, 20);

        if (v.length === 0) return "";
        return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
    }

    // ================= SUBMIT =================
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!title.trim()) return;

        try {

            const res = await apiFetch("http://localhost:5001/api/tasks", {
                method: "POST",
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

            onCreate(); // hämta tasks på nytt

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

            <input
                placeholder="Titel"
                value={title}
                onChange={e => setTitle(formatInput(e.target.value))}
                required
            />

            <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <input
                placeholder="Kategori"
                value={category}
                onChange={e => setCategory(formatCategory(e.target.value))}
            />

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
