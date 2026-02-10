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
    const [newImages, setNewImages] = useState([]);
    const [imagesToRemove, setImagesToRemove] = useState([]);
    const [draggedIndex, setDraggedIndex] = useState(null);

    if (!task) return null;

    const hasChanges =
        formData.title !== task.title ||
        formData.category !== task.category ||
        formData.priority !== task.priority ||
        formData.deadline !== task.deadline ||
        newImages.length > 0 ||
        imagesToRemove.length > 0;

    const canSave =
        hasChanges &&
        formData.title.trim() &&
        formData.category.trim() &&
        formData.priority;

    const toggleComplete = async (e) => {
        e.stopPropagation();
        try {
            await taskService.toggleComplete(task._id, !task.completed);
            onUpdate?.();
        } catch {
            toast.error("Could not update task status");
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
            // Avbryt: återställ bilder
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

    const handleNewImages = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);
    };

    // ✅ Ta bort bild direkt från skärmen och markera för servern
    const removeOldImage = (img) => {
        setOldImages(prev => prev.filter(i => i !== img));
        setImagesToRemove(prev => [...prev, img]);
    };

    const removeNewImage = (index) =>
        setNewImages(prev => prev.filter((_, i) => i !== index));

    const handleDragStart = (index) => setDraggedIndex(index);

    const handleDragOver = (index, e) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const reordered = [...oldImages];
        const [moved] = reordered.splice(draggedIndex, 1);
        reordered.splice(index, 0, moved);

        setOldImages(reordered);
        setDraggedIndex(index);
    };

    const handleSave = async () => {
        if (!canSave) return;

        try {
            await taskService.update(task._id, formData);

            // Ta bort markerade bilder
            for (const img of imagesToRemove) {
                await taskService.removeImage(task._id, img);
            }

            // Lägg till nya bilder
            if (newImages.length > 0) {
                const fd = new FormData();
                newImages.forEach(img => fd.append("images", img));
                await taskService.addImages(task._id, fd);
            }

            toast.success("Task updated");
            setIsEditing(false);
            setImagesToRemove([]);
            setNewImages([]);
            onUpdate?.();
        } catch {
            toast.error("Failed to save task");
        }
    };

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
                            type="text"
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
                            onDragStart={() => handleDragStart(i)}
                            onDragOver={(e) => handleDragOver(i, e)}
                        >
                            <img
                                src={`${import.meta.env.VITE_API_URL}${img}`}
                                alt="Task"
                                onClick={() =>
                                    !isEditing && setActiveImage(`${import.meta.env.VITE_API_URL}${img}`)
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

                    {newImages.map((file, i) => (
                        <div key={i} className="image-wrapper">
                            <img src={URL.createObjectURL(file)} alt="New" />
                            <button className="remove-btn" onClick={() => removeNewImage(i)}>X</button>
                        </div>
                    ))}

                    {isEditing && <input type="file" multiple onChange={handleNewImages} />}
                </section>

                {showActions && editable && (
                    <footer className="task-actions">
                        {isEditing ? (
                            <>
                                <button className="edit" onClick={handleSave} disabled={!canSave}>
                                    Save
                                </button>
                                <button className="danger" onClick={handleEditToggle}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="edit" onClick={handleEditToggle}>
                                    Edit
                                </button>
                                <button className="danger" onClick={() => onDelete(task._id)}>
                                    Delete
                                </button>
                            </>
                        )}
                    </footer>
                )}
            </article>

            {activeImage && (
                <div className="image-modal" onClick={() => setActiveImage(null)}>
                    <img src={activeImage} alt="Preview" />
                </div>
            )}
        </>
    );
}

export default TaskItem;
