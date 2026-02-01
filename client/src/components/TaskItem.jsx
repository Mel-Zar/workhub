import { useState } from "react";
import { apiFetch } from "../api/ApiFetch";

function TaskItem({ task, onUpdate, onDelete }) {

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [priority, setPriority] = useState(task.priority);
    const [category, setCategory] = useState(task.category || "");
    const [deadline, setDeadline] = useState(
        task.deadline ? task.deadline.slice(0, 10) : ""
    );

    // ================= UPDATE =================
    async function save() {
        const res = await apiFetch(
            `http://localhost:5001/api/tasks/${task._id}`,
            {
                method: "PUT",
                body: JSON.stringify({
                    title,
                    priority,
                    category,
                    deadline
                })
            }
        );

        const data = await res.json();

        if (res.ok) {
            onUpdate(data);
            setEditing(false);
        }
    }

    // ================= TOGGLE =================
    async function toggleComplete() {

        const res = await apiFetch(
            `http://localhost:5001/api/tasks/${task._id}/toggle`,
            { method: "PATCH" }
        );

        const data = await res.json();

        if (res.ok) {
            onUpdate(data);
        }
    }

    // ================= DELETE =================
    async function remove() {

        const res = await apiFetch(
            `http://localhost:5001/api/tasks/${task._id}`,
            { method: "DELETE" }
        );

        if (res.ok) {
            onDelete(task._id);
        }
    }

    // ================= UI =================
    return (
        <div style={{ marginBottom: "12px" }}>

            <input
                type="checkbox"
                checked={task.completed}
                onChange={toggleComplete}
            />

            {editing ? (
                <>
                    <input
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
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    />

                    <input
                        type="date"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                    />

                    <button onClick={save}>Spara</button>
                    <button onClick={() => setEditing(false)}>Avbryt</button>
                </>
            ) : (
                <>
                    <span
                        style={{
                            textDecoration: task.completed
                                ? "line-through"
                                : "none"
                        }}
                    >
                        {task.title} ({task.priority})
                    </span>

                    <button onClick={() => setEditing(true)}>
                        Ändra
                    </button>

                    <button onClick={remove}>
                        Ta bort
                    </button>
                </>
            )}

        </div>
    );
}

export default TaskItem;
