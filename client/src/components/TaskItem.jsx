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

    // ================= FORMATTERS =================
    const capitalize = str =>
        str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

    const cleanCategory = str =>
        str ? str.replace(/[0-9]/g, "").trim() : "";

    // ================= STATE =================
    const [editing, setEditing] = useState(false);

    const [title, setTitle] = useState(capitalize(task.title));
    const [priority, setPriority] = useState(task.priority || "");
    const [category, setCategory] = useState(capitalize(task.category));
    const [deadline, setDeadline] = useState(
        task.deadline ? task.deadline.slice(0, 10) : ""
    );

    const [existingImages, setExistingImages] = useState(task.images || []);
    const [newImages, setNewImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);

    const today = new Date().toISOString().split("T")[0];

    // ================= IMAGE HANDLERS =================
    function handleAddImages(e) {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);
        e.target.value = null;
    }

    function removeExistingImage(index) {
        setExistingImages(prev => {
            const removed = prev[index];
            setRemovedImages(r => [...r, removed]);
            return prev.filter((_, i) => i !== index);
        });
    }

    function removeNewImage(index) {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    }

    // ================= SAVE =================
    async function handleSave() {
        const res = await apiFetch(`/api/tasks/${task._id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: capitalize(title),
                priority,
                category: capitalize(cleanCategory(category)),
                deadline
            })
        });

        if (!res.ok) return;

        // delete removed images
        for (let img of removedImages) {
            await apiFetch(`/api/tasks/${task._id}/images`, {
                method: "DELETE",
                body: JSON.stringify({ image: img })
            });
        }

        // upload new images
        if (newImages.length > 0) {
            const formData = new FormData();
            newImages.forEach(img => formData.append("images", img));

            await apiFetch(`/api/tasks/${task._id}/images`, {
                method: "POST",
                body: formData
            });
        }

        const finalRes = await apiFetch(`/api/tasks/${task._id}`);
        const finalData = await finalRes.json();

        if (finalRes.ok) onUpdate?.(finalData);

        setEditing(false);
        setNewImages([]);
        setRemovedImages([]);
    }

    // ================= ACTIONS =================
    async function toggleComplete() {
        const res = await apiFetch(`/api/tasks/${task._id}/toggle`, {
            method: "PATCH"
        });
        const data = await res.json();
        if (res.ok) onUpdate?.(data);
    }

    async function removeTask() {
        const res = await apiFetch(`/api/tasks/${task._id}`, {
            method: "DELETE"
        });
        if (res.ok) onDelete?.(task._id);
    }

    // ================= VALIDATION =================
    const canSave = title.trim() && priority && category.trim() && deadline && (existingImages.length + newImages.length > 0);

    // ================= RENDER =================
    return (
        <div
            onClick={clickable ? onClick : undefined}
            style={{
                border: "1px solid #ccc",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "10px",
                cursor: clickable ? "pointer" : "default"
            }}
        >

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
                    <input
                        value={title}
                        onChange={e => setTitle(capitalize(e.target.value))}
                        placeholder="Titel"
                    />

                    <select value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="">Choose priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <input
                        value={category}
                        onChange={e => setCategory(capitalize(e.target.value))}
                        placeholder="Kategori"
                    />

                    <input
                        type="date"
                        value={deadline}
                        min={today}
                        onChange={e => setDeadline(e.target.value)}
                    />

                    <h4>Bilder</h4>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {existingImages.map((img, i) => (
                            <div key={i}>
                                <img
                                    src={`http://localhost:5001${img}`}
                                    width="80"
                                    style={{ borderRadius: "6px" }}
                                />
                                <br />
                                <button type="button" onClick={() => removeExistingImage(i)}>
                                    ❌
                                </button>
                            </div>
                        ))}
                        {newImages.map((img, i) => (
                            <div key={i}>
                                <img
                                    src={URL.createObjectURL(img)}
                                    width="80"
                                    style={{ borderRadius: "6px" }}
                                />
                                <br />
                                <button type="button" onClick={() => removeNewImage(i)}>
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleAddImages}
                    />

                    <br />

                    <button onClick={handleSave} disabled={!canSave} style={{ cursor: canSave ? "pointer" : "not-allowed" }}>
                        Spara ändringar
                    </button>

                    <button onClick={() => setEditing(false)}>
                        Avbryt
                    </button>
                </>
            ) : (
                <>
                    <h4 style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                        {capitalize(task.title)}
                    </h4>

                    <p>{capitalize(task.priority)}</p>
                    <p>{capitalize(task.category)}</p>

                    {task.images?.length > 0 && (
                        <div style={{ display: "flex", gap: "8px" }}>
                            {task.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={`http://localhost:5001${img}`}
                                    width="60"
                                />
                            ))}
                        </div>
                    )}

                    {showActions && (
                        <div>
                            <button onClick={() => setEditing(true)}>Ändra</button>
                            <button onClick={removeTask}>Ta bort</button>
                        </div>
                    )}
                </>
            )}

        </div>
    );
}

export default TaskItem;
