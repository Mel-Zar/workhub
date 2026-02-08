import { useState } from "react";
import { toast } from "react-toastify";
import { capitalize, cleanCategory } from "../../utils/formatters";
import { taskService } from "../../services/taskService";

function TaskItem({ task, onUpdate, onDelete, showActions = true, editable = true, onClick }) {
    const original = {
        title: task.title,
        priority: task.priority || "",
        category: task.category || "",
        deadline: task.deadline ? task.deadline.slice(0, 10) : ""
    };

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(original.title);
    const [priority, setPriority] = useState(original.priority);
    const [category, setCategory] = useState(original.category);
    const [deadline, setDeadline] = useState(original.deadline);
    const [existingImages, setExistingImages] = useState(task.images || []);
    const [newImages, setNewImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);

    const today = new Date().toISOString().split("T")[0];

    function resetForm() {
        setTitle(original.title);
        setPriority(original.priority);
        setCategory(original.category);
        setDeadline(original.deadline);
        setExistingImages(task.images || []);
        setNewImages([]);
        setRemovedImages([]);
    }

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

    const totalImages = existingImages.length + newImages.length - removedImages.length;
    const allFieldsFilled = title.trim() && priority && category.trim() && deadline && totalImages > 0;
    const hasChanges = title !== original.title || priority !== original.priority || category !== original.category || deadline !== original.deadline || newImages.length > 0 || removedImages.length > 0;
    const canSave = editing && allFieldsFilled && hasChanges;

    // ================= SAVE =================
    const handleSave = (e) => {
        e.stopPropagation();
        if (!canSave) return;

        toast.info(
            <div>
                Är du säker på att du vill ändra tasken?
                <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                    <button onClick={async (e) => { e.stopPropagation(); await confirmSave(); }}>Ja</button>
                    <button onClick={(e) => { e.stopPropagation(); toast.dismiss(); }}>Avbryt</button>
                </div>
            </div>,
            { autoClose: false, closeOnClick: false }
        );
    };

    const confirmSave = async () => {
        toast.dismiss();
        try {
            // Uppdatera textfält
            await taskService.update(task._id, {
                title,
                priority,
                category: cleanCategory(category),
                deadline
            });

            // Ta bort bilder
            for (let img of removedImages) {
                await taskService.removeImage(task._id, img);
            }

            // Lägg till nya bilder
            if (newImages.length > 0) {
                const formData = new FormData();
                newImages.forEach(img => formData.append("images", img));
                await taskService.addImages(task._id, formData);
            }

            // Hämta färdig task
            const finalData = await taskService.getById(task._id);
            onUpdate?.(finalData);
            setExistingImages(finalData.images || []);
            toast.success("Task uppdaterad ✅");
            setEditing(false);
            setNewImages([]);
            setRemovedImages([]);

        } catch {
            toast.error("Kunde inte spara ändringar");
        }
    };


    // ================= DELETE =================
    const deleteTask = (e) => {
        e.stopPropagation();
        toast.info(
            <div>
                Är du säker på att du vill radera tasken?
                <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                    <button onClick={async (e) => { e.stopPropagation(); await confirmDelete(); }}>Ja</button>
                    <button onClick={(e) => { e.stopPropagation(); toast.dismiss(); }}>Avbryt</button>
                </div>
            </div>,
            { autoClose: false, closeOnClick: false }
        );
    };

    const confirmDelete = async () => {
        toast.dismiss();
        try {
            await taskService.remove(task._id);
            onDelete?.(task._id);
            toast.success("Task borttagen 🗑️");
        } catch {
            toast.error("Kunde inte ta bort task");
        }
    };

    // ================= TOGGLE COMPLETE =================
    const toggleComplete = (e) => {
        e.stopPropagation();
        taskService.toggleComplete(task._id, !task.completed)
            .then(data => onUpdate?.(data))
            .catch(() => toast.error("Kunde inte uppdatera status"));
    };

    return (
        <div
            style={{
                border: "1px solid #ccc",
                padding: 12,
                borderRadius: 8,
                cursor: onClick && !editing ? "pointer" : "default",
                opacity: editing ? 0.9 : 1
            }}
            onClick={() => { if (onClick && !editing) onClick(); }}
        >
            {showActions &&
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={toggleComplete}
                    onClick={(e) => e.stopPropagation()}
                />
            }

            {editing && editable ? (
                <>
                    <input value={title} onChange={e => setTitle(e.target.value)} />
                    <select value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="">Choose priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <input value={category} onChange={e => setCategory(e.target.value)} />
                    <input type="date" min={today} value={deadline} onChange={e => setDeadline(e.target.value)} />

                    <h4>Bilder</h4>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {existingImages.map((img, i) => (
                            <div key={i}>
                                <img src={`${import.meta.env.VITE_API_URL}${img}`} width="80" />
                                <br />
                                <button onClick={(e) => { e.stopPropagation(); removeExistingImage(i); }}>❌</button>
                            </div>
                        ))}
                        {newImages.map((img, i) => (
                            <div key={i}>
                                <img src={URL.createObjectURL(img)} width="80" />
                                <br />
                                <button onClick={(e) => { e.stopPropagation(); removeNewImage(i); }}>❌</button>
                            </div>
                        ))}
                    </div>

                    <input type="file" multiple accept="image/*" onChange={(e) => { e.stopPropagation(); handleAddImages(e); }} />
                    <br />
                    <button disabled={!canSave} onClick={handleSave}>Spara</button>
                    <button onClick={(e) => { e.stopPropagation(); resetForm(); setEditing(false); }}>Avbryt</button>
                    <button onClick={deleteTask} style={{ background: "crimson", color: "white" }}>Ta bort</button>
                </>
            ) : (
                <>
                    <h4>{capitalize(task.title)}</h4>
                    <p>{capitalize(task.priority)}</p>
                    <p>{capitalize(task.category)}</p>

                    {task.images?.length > 0 && (
                        <div style={{ display: "flex", gap: 8 }}>
                            {task.images.map((img, i) =>
                                <img key={i} src={`${import.meta.env.VITE_API_URL}${img}`} width="60" />
                            )}
                        </div>
                    )}

                    {editable && showActions &&
                        <button onClick={(e) => { e.stopPropagation(); setEditing(true); }}>Ändra</button>
                    }
                </>
            )}
        </div>
    );
}

export default TaskItem;
