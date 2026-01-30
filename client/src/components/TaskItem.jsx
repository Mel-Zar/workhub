import { useState } from "react";

function TaskItem({ task, onUpdate, onDelete }) {

    const [editing, setEditing] = useState(false);

    const [title, setTitle] = useState(task.title);
    const [priority, setPriority] = useState(task.priority || "medium");
    const [category, setCategory] = useState(task.category || "");
    const [deadline, setDeadline] = useState(
        task.deadline ? task.deadline.slice(0, 10) : ""
    );

    // SAVE ALL FIELDS
    const save = async () => {

        const res = await fetch(
            `http://localhost:5001/api/tasks/${task._id}`,
            {
                method: "PUT",
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
            }
        );

        const data = await res.json();
        onUpdate(data);
        setEditing(false);
    };

    // TOGGLE COMPLETE
    const toggleComplete = async () => {
        const res = await fetch(
            `http://localhost:5001/api/tasks/${task._id}/toggle`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        const data = await res.json();
        onUpdate(data);
    };

    // DELETE
    const remove = async () => {
        await fetch(
            `http://localhost:5001/api/tasks/${task._id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        onDelete(task._id);
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
