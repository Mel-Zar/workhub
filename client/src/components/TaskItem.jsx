import { useState } from "react";
import { apiFetch } from "../api/ApiFetch";

function TaskItem({
    task,
    onUpdate,
    onDelete,
    showActions = true,
    clickable = false,
    onClick
}) {

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [priority, setPriority] = useState(task.priority);
    const [category, setCategory] = useState(task.category || "");
    const [deadline, setDeadline] = useState(
        task.deadline ? task.deadline.slice(0, 10) : ""
    );

    const [newImages, setNewImages] = useState([]);

    // ================= UPDATE TEXT =================
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
            onUpdate?.(data);
            setEditing(false);
        }
    }

    // ================= ADD IMAGES =================
    async function uploadImages() {

        if (newImages.length === 0) return;

        const formData = new FormData();
        newImages.forEach(img =>
            formData.append("images", img)
        );

        const res = await apiFetch(
            `http://localhost:5001/api/tasks/${task._id}/images`,
            {
                method: "POST",
                body: formData,
                headers: {}
            }
        );

        const data = await res.json();

        if (res.ok) {
            onUpdate?.(data);
            setNewImages([]);
        }
    }

    // ================= REMOVE IMAGE =================
    async function deleteImage(image) {
        const res = await apiFetch(
            `http://localhost:5001/api/tasks/${task._id}/images`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image })
            }
        );

        const data = await res.json();

        if (res.ok) {
            onUpdate?.(data);
        }
    }


    // ================= TOGGLE =================
    async function toggleComplete() {
        const res = await apiFetch(
            `http://localhost:5001/api/tasks/${task._id}/toggle`,
            { method: "PATCH" }
        );

        const data = await res.json();
        if (res.ok) onUpdate?.(data);
    }

    // ================= DELETE TASK =================
    async function remove() {
        const res = await apiFetch(
            `http://localhost:5001/api/tasks/${task._id}`,
            { method: "DELETE" }
        );

        if (res.ok) onDelete?.(task._id);
    }

    // ================= UI =================
    return (
        <div
            onClick={clickable ? onClick : undefined}
            style={{
                border: "1px solid #ccc",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "10px",
                cursor: clickable ? "pointer" : "default"
            }}
        >

            {/* CHECKBOX */}
            {showActions && (
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={toggleComplete}
                    onClick={e => e.stopPropagation()}
                />
            )}

            {editing ? (
                <>
                    <input value={title} onChange={e => setTitle(e.target.value)} />

                    <select value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <input value={category} onChange={e => setCategory(e.target.value)} />
                    <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />

                    <button onClick={save}>Spara text</button>
                    <button onClick={() => setEditing(false)}>Klar</button>

                    {/* EXISTING IMAGES */}
                    <h4>Bilder</h4>

                    <div style={{ display: "flex", gap: "6px" }}>
                        {task.images?.map((img, i) => (
                            <div key={i}>
                                <img
                                    src={`http://localhost:5001${img}`}
                                    width="80"
                                    style={{ borderRadius: "6px" }}
                                />
                                <button onClick={() => deleteImage(img)}>X</button>
                            </div>
                        ))}
                    </div>

                    {/* ADD NEW */}
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e =>
                            setNewImages(prev => [
                                ...prev,
                                ...Array.from(e.target.files)
                            ])
                        }
                    />

                    <button onClick={uploadImages}>
                        Ladda upp bilder
                    </button>
                </>
            ) : (
                <>
                    <h4 style={{
                        textDecoration: task.completed
                            ? "line-through"
                            : "none"
                    }}>
                        {task.title}
                    </h4>

                    <p>{task.priority}</p>

                    {task.images?.length > 0 && (
                        <div style={{ display: "flex", gap: "6px" }}>
                            {task.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={`http://localhost:5001${img}`}
                                    width="70"
                                    style={{ borderRadius: "5px" }}
                                />
                            ))}
                        </div>
                    )}

                    {showActions && (
                        <div>
                            <button onClick={() => setEditing(true)}>Ändra</button>
                            <button onClick={remove}>Ta bort</button>
                        </div>
                    )}
                </>
            )}

        </div>
    );
}

export default TaskItem;
