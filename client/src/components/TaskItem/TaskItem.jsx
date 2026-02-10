import { useState } from "react";
import { toast } from "react-toastify";
import { taskService } from "../../services/taskService";
import { capitalize } from "../../utils/formatters";
import "./TaskItem.scss";

const PRIORITY_OPTIONS = ["low", "medium", "high"];

function TaskItem({ task, onUpdate, onDelete, showActions = true, editable = false }) {
    const [activeImage, setActiveImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        title: task?.title || "",
        category: task?.category || "",
        priority: task?.priority || "",
        deadline: task?.deadline || "",
    });

    const [oldImages, setOldImages] = useState(task?.images || []);

    // { file, preview }
    const [newImages, setNewImages] = useState([]);

    const [imagesToRemove, setImagesToRemove] = useState([]);
    const [dragged, setDragged] = useState({ type: null, index: null });

    if (!task) return null;

    /* =========================
       VALIDATION
    ========================= */

    const allInputsFilled =
        formData.title.trim() &&
        formData.category.trim() &&
        formData.priority &&
        formData.deadline;

    const hasAtLeastOneImage =
        oldImages.length + newImages.length > 0;

    const hasChanges =
        formData.title !== task.title ||
        formData.category !== task.category ||
        formData.priority !== task.priority ||
        formData.deadline !== task.deadline ||
        imagesToRemove.length > 0 ||
        newImages.length > 0;

    const canSave =
        allInputsFilled &&
        hasAtLeastOneImage &&
        hasChanges;

    /* =========================
       HANDLERS
    ========================= */

    const toggleComplete = async (e) => {
        e.stopPropagation();
        try {
            await taskService.toggleComplete(task._id);
            onUpdate?.();
        } catch {
            toast.error("Could not update task");
        }
    };

    const handleEditToggle = (e) => {
        e.stopPropagation();

        if (!isEditing) {
            setFormData({
                title: task.title || "",
                category: task.category || "",
                priority: task.priority || "",
                deadline: task.deadline || "",
            });
            setOldImages(task.images || []);
            setNewImages([]);
            setImagesToRemove([]);
        } else {
            setOldImages(task.images || []);
            setNewImages([]);
            setImagesToRemove([]);
        }

        setIsEditing(prev => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /* =========================
       NEW IMAGES
    ========================= */

    const handleNewImages = (e) => {
        const files = Array.from(e.target.files);

        const withPreview = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setNewImages(prev => [...prev, ...withPreview]);
        e.target.value = "";
    };

    /* =========================
       IMAGE REMOVE
    ========================= */

    const removeOldImage = (img) => {
        setOldImages(prev => prev.filter(i => i !== img));
        setImagesToRemove(prev => [...prev, img]);
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    /* =========================
       DRAG & DROP
    ========================= */

    const handleDragStart = (type, index) => {
        setDragged({ type, index });
    };

    const handleDragOver = (type, index, e) => {
        e.preventDefault();
        if (!dragged.type) return;
        if (dragged.type !== type || dragged.index === index) return;

        if (type === "old") {
            const updated = [...oldImages];
            const [moved] = updated.splice(dragged.index, 1);
            updated.splice(index, 0, moved);
            setOldImages(updated);
        }

        if (type === "new") {
            const updated = [...newImages];
            const [moved] = updated.splice(dragged.index, 1);
            updated.splice(index, 0, moved);
            setNewImages(updated);
        }

        setDragged({ type, index });
    };

    /* =========================
       SAVE  ✅ FIX HÄR
    ========================= */

    const handleSave = async () => {
        if (!canSave) return;

        try {
            await taskService.update(task._id, formData);

            for (const img of imagesToRemove) {
                await taskService.removeImage(task._id, img);
            }

            if (newImages.length > 0) {
                const fd = new FormData();
                newImages.forEach(img => fd.append("images", img.file));
                await taskService.addImages(task._id, fd);

                // ✅ NYTT: visa nya bilder DIREKT efter save
                setOldImages(prev => [
                    ...prev,
                    ...newImages.map(img => img.preview)
                ]);
            }

            toast.success("Task updated");
            setIsEditing(false);
            setImagesToRemove([]);
            setNewImages([]);
            onUpdate?.(); // backend-sync
        } catch {
            toast.error("Failed to save task");
        }
    };

    /* =========================
       RENDER
    ========================= */

    return (
        <>
            <article className="task-item">
                <header className="task-header">
                    {showActions && (
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={toggleComplete}
                        />
                    )}

                    {isEditing ? (
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Task title"
                        />
                    ) : (
                        <h4>{capitalize(task.title)}</h4>
                    )}
                </header>

                <div className="task-meta">
                    {isEditing ? (
                        <>
                            <input
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Category"
                            />

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="">Select priority</option>
                                {PRIORITY_OPTIONS.map(p => (
                                    <option key={p} value={p}>
                                        {capitalize(p)}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline?.slice(0, 10)}
                                onChange={handleChange}
                            />
                        </>
                    ) : (
                        <>
                            <span className={`badge priority ${task.priority}`}>
                                {capitalize(task.priority)}
                            </span>
                            <span className="badge category">
                                {capitalize(task.category)}
                            </span>
                            {task.deadline && (
                                <span className="badge deadline">
                                    Due {task.deadline.slice(0, 10)}
                                </span>
                            )}
                        </>
                    )}
                </div>

                <section className="task-images">
                    {oldImages.map((img, i) => (
                        <div
                            key={img + i}
                            className="image-wrapper"
                            draggable={isEditing}
                            onDragStart={() => handleDragStart("old", i)}
                            onDragOver={(e) => handleDragOver("old", i, e)}
                        >
                            <img
                                src={img.startsWith("blob:")
                                    ? img
                                    : `${import.meta.env.VITE_API_URL}${img}`}
                                alt=""
                                onClick={() =>
                                    !isEditing &&
                                    setActiveImage(
                                        img.startsWith("blob:")
                                            ? img
                                            : `${import.meta.env.VITE_API_URL}${img}`
                                    )
                                }
                            />
                            {isEditing && (
                                <button
                                    className="remove-btn"
                                    onClick={() => removeOldImage(img)}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}

                    {newImages.map((img, i) => (
                        <div
                            key={img.preview}
                            className="image-wrapper"
                            draggable={isEditing}
                            onDragStart={() => handleDragStart("new", i)}
                            onDragOver={(e) => handleDragOver("new", i, e)}
                        >
                            <img src={img.preview} alt="new" />
                            <button
                                className="remove-btn"
                                onClick={() => removeNewImage(i)}
                            >
                                X
                            </button>
                        </div>
                    ))}

                    {isEditing && (
                        <input type="file" multiple onChange={handleNewImages} />
                    )}
                </section>

                {showActions && editable && (
                    <footer className="task-actions">
                        {isEditing ? (
                            <>
                                <button
                                    className="edit"
                                    onClick={handleSave}
                                    disabled={!canSave}
                                >
                                    Save
                                </button>
                                <button
                                    className="danger"
                                    onClick={handleEditToggle}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="edit"
                                    onClick={handleEditToggle}
                                >
                                    Edit
                                </button>
                                <button
                                    className="danger"
                                    onClick={() => onDelete(task._id)}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </footer>
                )}
            </article>

            {activeImage && (
                <div
                    className="image-modal"
                    onClick={() => setActiveImage(null)}
                >
                    <img src={activeImage} alt="preview" />
                </div>
            )}
        </>
    );
}

export default TaskItem;
