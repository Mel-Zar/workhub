import { useState } from "react";
import { apiFetch } from "../api/ApiFetch";

function TaskItem({ task, onUpdate, onDelete, showActions = true, clickable = false, onClick }) {

    function formatText(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    function formatCategory(str) {
        if (!str) return "";
        const firstWord = str.split(/\s+/)[0] || "";
        return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
    }

    const [editing, setEditing] = useState(false);

    // ✅ FIX: lowercase priority så select matchar
    const [title, setTitle] = useState(formatText(task.title));
    const [priority, setPriority] = useState(task.priority?.toLowerCase() || "");
    const [category, setCategory] = useState(formatCategory(task.category));
    const [deadline, setDeadline] = useState(
        task.deadline ? task.deadline.slice(0, 10) : ""
    );

    const [localImages, setLocalImages] = useState(task.images ? [...task.images] : []);
    const [newImages, setNewImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);

    const today = new Date().toISOString().split("T")[0];

    // ✅ VALIDATION
    const isFormValid =
        title &&
        priority &&
        category &&
        deadline &&
        (localImages.length + newImages.length) >= 1;

    // ================= SAVE =================
    async function save() {

        if (!isFormValid) return;

        const processedTitle = formatText(title);
        const processedCategory = formatCategory(category);

        const textRes = await apiFetch(
            `http://localhost:5001/api/tasks/${task._id}`,
            {
                method: "PUT",
                body: JSON.stringify({
                    title: processedTitle,
                    priority,
                    category: processedCategory,
                    deadline
                })
            }
        );

        if (!textRes.ok) return;

        // Ta bort bilder
        for (let img of removedImages) {
            await apiFetch(
                `http://localhost:5001/api/tasks/${task._id}/images`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: img })
                }
            );
        }

        // Ladda upp nya bilder
        if (newImages.length > 0) {
            const formData = new FormData();
            newImages.forEach(img => formData.append("images", img));

            await apiFetch(
                `http://localhost:5001/api/tasks/${task._id}/images`,
                {
                    method: "POST",
                    body: formData
                }
            );
        }

        // Hämta uppdaterad task
        const finalRes = await apiFetch(
            `http://localhost:5001/api/tasks/${task._id}`
        );

        const finalData = await finalRes.json();
        if (finalRes.ok) onUpdate?.(finalData);

        setNewImages([]);
        setRemovedImages([]);
        setEditing(false);
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

    // ================= DELETE =================
    async function remove() {
        const ok = window.confirm("Är du säker på att du vill ta bort denna task?");
        if (!ok) return;

        const res = await apiFetch(
            `http://localhost:5001/api/tasks/${task._id}`,
            { method: "DELETE" }
        );

        if (res.ok) onDelete?.(task._id);
    }

    // ================= IMAGES =================
    function handleSelectImages(e) {
        const selected = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...selected]);
        e.target.value = null;
    }

    function removeLocalImage(index, isNew) {
        if (isNew) {
            setNewImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setLocalImages(prev => {
                const removed = prev[index];
                setRemovedImages(r => [...r, removed]);
                return prev.filter((_, i) => i !== index);
            });
        }
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
                        <option value="">Choose priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <input
                        value={category}
                        onChange={e => {
                            const value = e.target.value.replace(/[0-9]/g, "");
                            setCategory(formatCategory(value));
                        }}
                    />

                    <input
                        type="date"
                        value={deadline}
                        min={today}
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

                    <button
                        onClick={save}
                        disabled={!isFormValid}
                        style={{
                            opacity: !isFormValid ? 0.5 : 1,
                            cursor: !isFormValid ? "not-allowed" : "pointer"
                        }}
                    >
                        Spara ändringar
                    </button>

                    <button onClick={() => setEditing(false)}>Avbryt</button>
                </>
            ) : (
                <>
                    <h4 style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                        {formatText(task.title)}
                    </h4>

                    <p>{formatText(task.priority)}</p>

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
