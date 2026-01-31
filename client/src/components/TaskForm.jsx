import { useState } from "react";

function TaskForm({ onCreate }) {

    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("medium");
    const [category, setCategory] = useState("work");
    const [deadline, setDeadline] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!title.trim()) return;

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Du är inte inloggad");
            return;
        }

        try {
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
            setCategory("work");
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
                onChange={e => setTitle(e.target.value)}
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
            <select
                value={category}
                onChange={e => setCategory(e.target.value)}
            >
                <option value="work">Work</option>
                <option value="school">School</option>
                <option value="personal">Personal</option>
                <option value="shopping">Shopping</option>
            </select>

            {/* DEADLINE */}
            <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
            />

            <button>Skapa</button>

        </form>
    );
}

export default TaskForm;
