import { useState } from "react";
import { apiFetch } from "../api/ApiFetch";

function TaskItem({ task, onUpdate, onDelete, showActions = true, clickable = false, onClick }) {

    const [editing, setEditing] = useState(false);

    // ======= TEXT STATES =======
    const [title, setTitle] = useState(formatText(task.title));
    const [priority, setPriority] = useState(task.priority);
    const [category, setCategory] = useState(formatCategory(task.category));
    const [deadline, setDeadline] = useState(task.deadline ? task.deadline.slice(0, 10) : "");

    // ======= IMAGE STATES =======
    const [localImages, setLocalImages] = useState(task.images ? [...task.images] : []);
    const [newImages, setNewImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);

    // ================= CAPITALIZE FUNCTIONS =================
    function formatText(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    function formatCategory(str) {
        if (!str) return "";
        const firstWord = str.split(/\s+/)[0] || "";
        return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
    }

    // ================= SAVE CHANGES =================
    async function save() {
        const processedTitle = formatText(title);
        const processedCategory = formatCategory(category);

        // 1️⃣ Update task text
        const textRes = await apiFetch(`http://localhost:5001/api/tasks/${task._id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: processedTitle,
                priority,
                category: processedCategory,
                deadline
            })
        });
        if (!textRes.ok) return;

        // 2️⃣ Remove images marked for deletion
        for (let img of removedImages) {
            await apiFetch(`http://localhost:5001/api/tasks/${task._id}/images`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: img })
            });
        }

        // 3️⃣ Upload new images
        if (newImages.length > 0) {
            const formData = new FormData();
            newImages.forEach(img => formData.append("images", img));
            await apiFetch(`http://localhost:5001/api/tasks/${task._id}/images`, {
                method: "POST",
                body: formData,
                headers: {}
            });
        }

        // 4️⃣ Refresh task from server
        const finalRes = await apiFetch(`http://localhost:5001/api/tasks/${task._id}`);
        const finalData = await finalRes.json();
        if (finalRes.ok) onUpdate?.(finalData);

        // 5️⃣ Reset local states
        setNewImages([]);
        setRemovedImages([]);
        setEditing(false);
    }

    // ================= TOGGLE COMPLETED =================
    async function toggleComplete() {
        const res = await apiFetch(`http://localhost:5001/api/tasks/${task._id}/toggle`, { method: "PATCH" });
        const data = await res.json();
        if (res.ok) onUpdate?.(data);
    }

    // ================= DELETE TASK =================
    async function remove() {
        const res = await apiFetch(`http://localhost:5001/api/tasks/${task._id}`, { method: "DELETE" });
        if (res.ok) onDelete?.(task._id);
    }

    // ================= IMAGE HANDLERS =================
    function handleSelectImages(e) {
        const selected = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...selected]);
        e.target.value = null; // reset input så man kan välja samma fil igen
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
            style={{
                border: "1px solid #ccc",
                padding: "12px",
                borderRadius: "6px",
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
                        onChange={e => setTitle(formatText(e.target.value))}
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
                        onChange={e => setCategory(formatCategory(e.target.value))}
                    />

                    <input
                        type="date"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                    />

                    <h4>Bilder</h4>
                    <div style={{ display: "flex", gap: "6px" }}>
                        {localImages.map((img, i) => (
                            <div key={i}>
                                <img
                                    src={`http://localhost:5001${img}`}
                                    width="80"
                                    style={{ borderRadius: "6px" }}
                                />
                                <button type="button" onClick={() => removeLocalImage(i, false)}>❌</button>
                            </div>
                        ))}
                        {newImages.map((img, i) => (
                            <div key={i}>
                                <img
                                    src={URL.createObjectURL(img)}
                                    width="80"
                                    style={{ borderRadius: "6px" }}
                                />
                                <button type="button" onClick={() => removeLocalImage(i, true)}>❌</button>
                            </div>
                        ))}
                    </div>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleSelectImages}
                    />

                    <button onClick={save}>Spara ändringar</button>
                    <button onClick={() => setEditing(false)}>Avbryt</button>
                </>
            ) : (
                <>
                    <h4 style={{ textDecoration: task.completed ? "line-through" : "none" }}>{task.title}</h4>
                    <p>{task.priority}</p>
                    {task.images?.length > 0 && (
                        <div style={{ display: "flex", gap: "6px" }}>
                            {task.images.map((img, i) => (
                                <img key={i} src={`http://localhost:5001${img}`} width="70" style={{ borderRadius: "5px" }} />
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
