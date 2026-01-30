import { useState } from "react";

function TaskForm({ onCreate }) {

    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("medium");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim()) return;

        const res = await fetch("http://localhost:5001/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                title,
                priority,
                category,
                deadline
            })
        });

        const data = await res.json();
        onCreate(data);

        setTitle("");
        setCategory("");
        setDeadline("");
        setPriority("medium");
    }

    return (
        <form onSubmit={handleSubmit}>

            <input
                placeholder="Titel"
                value={title}
                onChange={e => setTitle(e.target.value)}
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
                onChange={e => setCategory(e.target.value)}
            />

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
