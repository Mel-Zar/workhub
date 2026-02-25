import { useState } from "react";
import { toast } from "react-toastify";
import { taskService } from "../../services/taskService";
import { capitalize } from "../../utils/formatters";
import TaskImages from "./TaskImages";
import "./TaskItem.scss";
import Dropdown from "../Ui/Dropdown";

const PRIORITY_OPTIONS = ["low", "medium", "high"];

function TaskItem({
    task,
    onUpdate,
    onDelete,
    showActions = true,
    editable = false,
    onClick,
    view
}) {
    const [activeImage, setActiveImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        title: task?.title || "",
        category: task?.category || "",
        priority: task?.priority || "",
        deadline: task?.deadline || "",
    });

    const [oldImages, setOldImages] = useState(task?.images || []);
    const [newImages, setNewImages] = useState([]); // { file, preview }
    const [imagesToRemove, setImagesToRemove] = useState([]);
    const [dragged, setDragged] = useState({ type: null, index: null });

    // Lägg till kopia av originalbilder för att kunna jämföra ordning
    const [originalImages, setOriginalImages] = useState(task?.images || []);

    if (!task) return null;

    /* =========================
      VALIDATION
      ========================= */

    const allInputsFilled =
        formData.title.trim() &&
        formData.category.trim() &&
        formData.priority &&
        formData.deadline;

    const hasAtLeastTwoImages = oldImages.length + newImages.length >= 2;

    const imagesOrderChanged = () => {
        if (!originalImages) return false;
        if (oldImages.length !== originalImages.length) return true;
        return oldImages.some((img, index) => img !== originalImages[index]);
    };

    const hasChanges =
        formData.title !== task.title ||
        formData.category !== task.category ||
        formData.priority !== task.priority ||
        formData.deadline !== task.deadline ||
        imagesToRemove.length > 0 ||
        newImages.length > 0 ||
        imagesOrderChanged();

    const canSave = allInputsFilled && hasAtLeastTwoImages && hasChanges;

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
            setOriginalImages(task.images || []); // Spara originalordning
            setNewImages([]);
            setImagesToRemove([]);
        } else {
            setOldImages(task.images || []);
            setOriginalImages(task.images || []); // Återställ originalordning
            setNewImages([]);
            setImagesToRemove([]);
        }

        setIsEditing((prev) => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    /* =========================
         IMAGES
      ========================= */

    const handleNewImages = (e) => {
        const files = Array.from(e.target.files);

        setNewImages((prev) => {
            const next = [...prev];

            for (const file of files) {
                const exists = next.some(
                    (img) =>
                        img.file.name === file.name &&
                        img.file.size === file.size &&
                        img.file.lastModified === file.lastModified,
                );

                if (exists) {
                    toast.warn(`"${file.name}" är redan vald`, {
                        toastId: `duplicate-${file.name}`,
                        autoClose: 2000,
                    });
                    continue;
                }

                next.push({
                    file,
                    preview: URL.createObjectURL(file),
                });
            }

            return next;
        });

        e.target.value = "";
    };

    const removeOldImage = (img) => {
        setOldImages((prev) => prev.filter((i) => i !== img));
        setImagesToRemove((prev) => [...prev, img]);
    };

    const removeNewImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    /* =========================
         DRAG & DROP (EDIT MODE)
      ========================= */

    const handleDragStart = (type, index) => {
        if (!isEditing) return;
        setDragged({ type, index });
    };

    const handleDragOver = (type, index, e) => {
        if (!isEditing) return;
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
         SAVE
      ========================= */

    const handleSave = async () => {
        if (!canSave) return;

        try {
            await taskService.update(task._id, formData);

            // 🗑️ remove old images
            for (const img of imagesToRemove) {
                await taskService.removeImage(task._id, img);
            }

            // 📤 upload new images
            if (newImages.length > 0) {
                const fd = new FormData();
                newImages.forEach((img) => fd.append("images", img.file));
                await taskService.addImages(task._id, fd);
            }

            // ✅ OPTIMISTIC UI UPDATE
            const uploadedPreviews = newImages.map((img) => img.preview);

            setOldImages((prev) => [
                ...prev.filter((img) => !imagesToRemove.includes(img)),
                ...uploadedPreviews,
            ]);

            setOriginalImages([
                ...oldImages.filter((img) => !imagesToRemove.includes(img)),
                ...uploadedPreviews,
            ]); // uppdatera originalImages efter save

            toast.success("Task updated");

            setIsEditing(false);
            setImagesToRemove([]);
            setNewImages([]);

            onUpdate?.();
        } catch {
            toast.error("Failed to save task");
        }
    };

    const confirmSave = () => {
        toast.info(
            <div>
                <p>Are you sure you want to save changes?</p>
                <button
                    onClick={() => {
                        toast.dismiss();
                        handleSave();
                    }}
                >
                    Yes
                </button>
                <button onClick={() => toast.dismiss()}>No</button>
            </div>,
            { autoClose: false },
        );
    };

    /* =========================
         DELETE
      ========================= */

    const confirmDelete = () => {
        toast.error(
            <div>
                <p>Are you sure you want to delete this task?</p>
                <button
                    onClick={() => {
                        toast.dismiss();
                        onDelete(task._id);
                    }}
                >
                    Yes
                </button>
                <button onClick={() => toast.dismiss()}>No</button>
            </div>,
            { autoClose: false },
        );
    };

    /* =========================
         RENDER
      ========================= */

    return (
        <>
            <article
                onClick={onClick}
                className={`task-item ${isEditing ? "editing" : ""} ${task.completed ? "completed" : ""}`}
            >

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

                            <Dropdown
                                value={formData.priority}
                                options={PRIORITY_OPTIONS.map((p) => ({
                                    value: p,
                                    label: capitalize(p),
                                }))}
                                placeholder="Select priority"
                                onChange={(val) =>
                                    setFormData((prev) => ({ ...prev, priority: val }))
                                }
                            />

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

                <TaskImages
                    view={view}
                    oldImages={oldImages}
                    newImages={newImages}
                    isEditing={isEditing}
                    onRemoveOld={removeOldImage}
                    onRemoveNew={removeNewImage}
                    onPreview={setActiveImage}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onNewImages={handleNewImages}
                />

                {showActions && editable && (
                    <footer className="task-actions">
                        {isEditing && !task.completed ? (
                            <>
                                <button className="edit" onClick={confirmSave} disabled={!canSave}>
                                    Save
                                </button>
                                <button className="danger" onClick={handleEditToggle}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                {!task.completed && (
                                    <button className="edit" onClick={handleEditToggle}>
                                        Edit
                                    </button>
                                )}
                                <button className="danger" onClick={confirmDelete}>
                                    Delete
                                </button>
                            </>
                        )}
                    </footer>
                )}


            </article>

            {activeImage && (
                <div className="image-modxal" onClick={() => setActiveImage(null)}>
                    <img src={activeImage} alt="preview" />
                </div>
            )}
        </>
    );
}

export default TaskItem;
