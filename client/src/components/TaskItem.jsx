import { useState } from "react";
import { apiFetch } from "../api/ApiFetch";
import { toast } from "react-toastify";

function TaskItem({ task, onUpdate, onDelete, showActions = true, clickable = false, onClick }) {

    const [editing, setEditing] = useState(false);

    const [title, setTitle] = useState(task.title);
    const [priority, setPriority] = useState(task.priority?.toLowerCase() || "");
    const [category, setCategory] = useState(task.category || "");
    const [deadline, setDeadline] = useState(task.deadline ? task.deadline.slice(0, 10) : "");
    const [localImages, setLocalImages] = useState(task.images ? [...task.images] : []);
    const [newImages, setNewImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);

    const today = new Date().toISOString().split("T")[0];

    const isFormValid = title && priority && category && deadline && (localImages.length + newImages.length) >= 1;

    // ================= SAVE =================
    async function save() {
        if (!isFormValid) return;

        const textRes = await apiFetch(`http://localhost:5001/api/tasks/${task._id}`, {
            method: "PUT",
            body: JSON.stringify({ title, priority, category, deadline })
        });

        if (!textRes.ok) {
            toast.error("Kunde inte uppdatera task ❌");
            return;
        }

        // Ta bort bilder
        for (let img of removedImages) {
            await apiFetch(`http://localhost:5001/api/tasks/${task._id}/images`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: img })
            });
        }

        // Lägg till nya bilder
        if (newImages.length > 0) {
            const formData = new FormData();
            newImages.forEach(img => formData.append("images", img));
            await apiFetch(`http://localhost:5001/api/tasks/${task._id}/images`, {
                method: "POST",
                body: formData
            });
        }

        const finalRes = await apiFetch(`http://localhost:5001/api/tasks/${task._id}`);
        const finalData = await finalRes.json();
        if (finalRes.ok) {
            onUpdate?.(finalData);
            toast.success("Task uppdaterad ✏️");
        }

        setEditing(false);
        setNewImages([]);
        setRemovedImages([]);
    }

    // ================= TOGGLE =================
    async function toggleComplete() {
        const res = await apiFetch(`http://localhost:5001/api/tasks/${task._id}/toggle`, { method: "PATCH" });
        const data = await res.json();
        if (res.ok) {
            onUpdate?.(data);
            toast.info("Status ändrad 🔄");
        }
    }

    // ================= DELETE =================
    async function remove() {
        if (!window.confirm("Är du säker på att du vill ta bort denna task?")) return;

        const res = await apiFetch(`http://localhost:5001/api/tasks/${task._id}`, { method: "DELETE" });
        if (res.ok) {
            onDelete?.(task._id);
            toast.success("Task borttagen 🗑️");
        } else {
            toast.error("Kunde inte ta bort task ❌");
        }
    }

    // ================= IMAGES =================
    function handleSelectImages(e) {
        const selected = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...selected]);
        e.target.value = null;
    }

    function removeLocalImage(index, isNew) {
        if (isNew) setNewImages(prev => prev.filter((_, i) => i !== index));
        else setLocalImages(prev => {
            const removed = prev[index];
            setRemovedImages(r => [...r, removed]);
            return prev.filter((_, i) => i !== index);
        });
    }

    // ================= RENDER =================
    return (
        <div
            onClick={clickable ? onClick : undefined}
            style={{ border: "1px solid #ccc", padding: "12px", borderRadius: "6px", marginBottom: "10px", cursor: clickable ? "pointer" : "default" }}
        >

            {showActions && !editing && (
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
                        <option value="">Choose priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <input value={category} onChange={e => setCategory(e.target.value)} />
                    <input type="date" value={deadline} min={today} onChange={e => setDeadline(e.target.value)} />

                    <h4>Bilder</h4>
                    <div style={{ display: "flex", gap: "6px" }}>
                        {localImages.map((img, i) => (
                            <div key={i}>
                                <img src={`http://localhost:5001${img}`} width="80" style={{ borderRadius: "6px" }} />
                                <button type="button" onClick={() => removeLocalImage(i, false)}>❌</button>
                            </div>
                        ))}
                        {newImages.map((img, i) => (
                            <div key={i}>
                                <img src={URL.createObjectURL(img)} width="80" style={{ borderRadius: "6px" }} />
                                <button type="button" onClick={() => removeLocalImage(i, true)}>❌</button>
                            </div>
                        ))}
                    </div>

                    <input type="file" multiple accept="image/*" onChange={handleSelectImages} />

                    <div style={{ marginTop: "10px" }}>
                        <button onClick={save} disabled={!isFormValid} style={{ marginRight: "6px" }}>Spara ändringar</button>
                        <button onClick={() => setEditing(false)} style={{ marginRight: "6px" }}>Avbryt</button>
                        <button onClick={remove} style={{ background: "#ff4d4d", color: "white" }}>Ta bort</button>
                    </div>
                </>
            ) : (
                <>
                    <h4 style={{ textDecoration: task.completed ? "line-through" : "none" }}>{task.title}</h4>
                    <p>{task.priority}</p>
                    {task.images?.length > 0 && <div style={{ display: "flex", gap: "6px" }}>{task.images.map((img, i) => <img key={i} src={`http://localhost:5001${img}`} width="70" style={{ borderRadius: "5px" }} />)}</div>}
                    {showActions && <div style={{ marginTop: "10px" }}><button onClick={() => setEditing(true)}>Ändra</button></div>}
                </>
            )}

        </div>
    );
}

export default TaskItem;
