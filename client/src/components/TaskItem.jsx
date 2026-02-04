import { useState } from "react";
import { apiFetch } from "../api/ApiFetch";
import { toast } from "react-toastify";

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

    // ================= ORIGINAL VALUES =================
    const original = {
        title: capitalize(task.title),
        priority: task.priority || "",
        category: capitalize(task.category),
        deadline: task.deadline ? task.deadline.slice(0, 10) : ""
    };

    // ================= STATE =================
    const [editing, setEditing] = useState(false);

    const [title, setTitle] = useState(original.title);
    const [priority, setPriority] = useState(original.priority);
    const [category, setCategory] = useState(original.category);
    const [deadline, setDeadline] = useState(original.deadline);

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

        if (!res.ok) {
            toast.error("Kunde inte spara ändringar");
            return;
        }

        for (let img of removedImages) {
            await apiFetch(`/api/tasks/${task._id}/images`, {
                method: "DELETE",
                body: JSON.stringify({ image: img })
            });
        }

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

        if (finalRes.ok) {
            onUpdate?.(finalData);
            toast.success("Task uppdaterad ✅");
        }

        setEditing(false);
        setNewImages([]);
        setRemovedImages([]);
    }

    // ================= DELETE CONFIRM =================
    function confirmDeleteTask() {
        toast.info(
            ({ closeToast }) => (
                <div>
                    <p>Vill du verkligen ta bort denna task?</p>
                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                        <button
                            onClick={async () => {
                                closeToast();
                                await deleteTask();
                            }}
                        >
                            Ja
                        </button>

                        <button onClick={closeToast}>
                            Avbryt
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    }

    // ================= DELETE =================
    async function deleteTask() {
        const res = await apiFetch(`/api/tasks/${task._id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            toast.error("Kunde inte ta bort task");
            return;
        }

        onDelete?.(task._id);
        toast.success("Task borttagen 🗑️");
    }

    // ================= TOGGLE COMPLETED (FIXED) =================
    async function toggleComplete(e) {
        e.stopPropagation();

        try {
            const res = await apiFetch(`/api/tasks/${task._id}`, {
                method: "PUT",
                body: JSON.stringify({
                    completed: !task.completed
                })
            });

            if (!res.ok) throw new Error();

            const data = await res.json();
            onUpdate?.(data);

        } catch {
            toast.error("Kunde inte uppdatera status");
        }
    }

    // ================= CHANGE CHECK =================
    const hasChanges =
        title !== original.title ||
        priority !== original.priority ||
        category !== original.category ||
        deadline !== original.deadline ||
        newImages.length > 0 ||
        removedImages.length > 0;

    const canSave =
        hasChanges &&
        title.trim() &&
        priority &&
        category.trim() &&
        deadline &&
        (existingImages.length + newImages.length > 0);

    // ================= RENDER =================
    return (
        <div
            onClick={clickable ? onClick : undefined}
            style={{
                border: "1px solid #ccc",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "10px",
                cursor: clickable ? "pointer" : "default",
                background: task.completed ? "#f1f1f1" : "white"
            }}
        >

            {showActions && (
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={toggleComplete}
                />
            )}

            {editing ? (
                <>
                    <input value={title} onChange={e => setTitle(capitalize(e.target.value))} />

                    <select value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="">Choose priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <input value={category} onChange={e => setCategory(capitalize(e.target.value))} />

                    <input type="date" value={deadline} min={today} onChange={e => setDeadline(e.target.value)} />

                    <h4>Bilder</h4>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {existingImages.map((img, i) => (
                            <div key={i}>
                                <img src={`http://localhost:5001${img}`} width="80" />
                                <br />
                                <button type="button" onClick={() => removeExistingImage(i)}>❌</button>
                            </div>
                        ))}

                        {newImages.map((img, i) => (
                            <div key={i}>
                                <img src={URL.createObjectURL(img)} width="80" />
                                <br />
                                <button type="button" onClick={() => removeNewImage(i)}>❌</button>
                            </div>
                        ))}
                    </div>

                    <input type="file" multiple accept="image/*" onChange={handleAddImages} />

                    <br />

                    <button onClick={handleSave} disabled={!canSave}>
                        Spara ändringar
                    </button>

                    <button onClick={() => setEditing(false)}>
                        Avbryt
                    </button>

                    <button
                        onClick={confirmDeleteTask}
                        style={{ background: "crimson", color: "white" }}
                    >
                        Ta bort task
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
                        <div style={{ display: "flex", gap: 8 }}>
                            {task.images.map((img, i) => (
                                <img key={i} src={`http://localhost:5001${img}`} width="60" />
                            ))}
                        </div>
                    )}

                    {showActions && (
                        <button onClick={() => setEditing(true)}>
                            Ändra
                        </button>
                    )}
                </>
            )}

        </div>
    );
}

export default TaskItem;
