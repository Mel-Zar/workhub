import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

function TaskItem({ task, onUpdate, onDelete }) {

    const { getValidAccessToken, logout } = useContext(AuthContext);

    const [editing, setEditing] = useState(false);

    const [title, setTitle] = useState(task.title);
    const [priority, setPriority] = useState(task.priority || "medium");
    const [category, setCategory] = useState(task.category || "");
    const [deadline, setDeadline] = useState(
        task.deadline ? task.deadline.slice(0, 10) : ""
    );

    // ================= SAVE =================
    const save = async () => {
        try {
            const token = await getValidAccessToken();
            if (!token) {
                logout();
                return;
            }

            const res = await fetch(
                `http://localhost:5001/api/tasks/${task._id}`,
                {
                    method: "PUT",
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
                }
            );

            const data = await res.json();

            if (res.ok) {
                onUpdate(data);
                setEditing(false);
            }

        } catch (err) {
            console.log(err);
        }
    };

    // ================= TOGGLE COMPLETE =================
    const toggleComplete = async () => {
        try {
            const token = await getValidAccessToken();
            if (!token) {
                logout();
                return;
            }

            const res = await fetch(
                `http://localhost:5001/api/tasks/${task._id}/toggle`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if (res.ok) {
                onUpdate(data);
            }

        } catch (err) {
            console.log(err);
        }
    };

    // ================= DELETE =================
    const remove = async () => {
        try {
            const token = await getValidAccessToken();
            if (!token) {
                logout();
                return;
            }

            const res = await fetch(
                `http://localhost:5001/api/tasks/${task._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                onDelete(task._id);
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div style={{ marginBottom: "15px" }}>

            <input
                type="checkbox"
                checked={task.completed}
                onChange={toggleComplete}
            />

            {editing ? (
                <div>

                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Titel"
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
                        placeholder="Kategori"
                    />

                    <input
                        type="date"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                    />

                    <button onClick={save}>Spara</button>
                    <button onClick={() => setEditing(false)}>Avbryt</button>

                </div>
            ) : (
                <span
                    style={{
                        textDecoration: task.completed ? "line-through" : "none"
                    }}
                >
                    {task.title} ({task.priority})
                </span>
            )}

            {!editing && (
                <>
                    <button onClick={() => setEditing(true)}>Ändra</button>
                    <button onClick={remove}>Ta bort</button>
                </>
            )}

        </div>
    );
}

export default TaskItem;
