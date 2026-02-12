import { useState } from "react";
import { toast } from "react-toastify";
import { taskService } from "../../services/taskService";
import { capitalize, formatCategory } from "../../utils/formatters";
import Dropdown from "../Ui/Dropdown";
import TaskImages from "../TaskItem/TaskImages";
import "./TaskForm.scss";

const PRIORITY_OPTIONS = ["low", "medium", "high"];
const PRIORITY_DROPDOWN = PRIORITY_OPTIONS.map(p => ({
    value: p,
    label: capitalize(p)
}));

function TaskForm({ onCreate }) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");
    const [oldImages, setOldImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [dragged, setDragged] = useState({ type: null, index: null });

    const today = new Date().toISOString().split("T")[0];

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
                        img.file.lastModified === file.lastModified
                );

                if (exists) {
                    toast.warn(`"${file.name}" is already selected`, {
                        toastId: `duplicate-${file.name}`,
                        autoClose: 2000,
                    });
                    continue;
                }

                next.push({ file, preview: URL.createObjectURL(file) });
            }

            return next;
        });

        e.target.value = "";
    };

    const removeNewImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDragStart = (type, index) => {
        setDragged({ type, index });
    };

    const handleDragOver = (type, index, e) => {
        e.preventDefault();
        if (!dragged.type || dragged.type !== type || dragged.index === index) return;

        if (type === "new") {
            const updated = [...newImages];
            const [moved] = updated.splice(dragged.index, 1);
            updated.splice(index, 0, moved);
            setNewImages(updated);
        }

        setDragged({ type, index });
    };

    /* =========================
       SUBMIT
    ========================= */

    const canSubmit =
        title.trim() &&
        priority &&
        category.trim() &&
        deadline &&
        (oldImages.length + newImages.length > 0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canSubmit) {
            toast.error("All fields and at least one image are required.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", capitalize(title));
            formData.append("priority", priority.toLowerCase());
            formData.append("category", formatCategory(category));
            formData.append("deadline", deadline);
            newImages.forEach((img) => formData.append("images", img.file));

            await taskService.create(formData);

            toast.success("Task created successfully ✅");

            setTitle("");
            setPriority("");
            setCategory("");
            setDeadline("");
            setOldImages([]);
            setNewImages([]);
            setDragged({ type: null, index: null });

            onCreate?.();
        } catch {
            toast.error("Unable to create task.");
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h3>Create Task</h3>

            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(capitalize(e.target.value))}
            />

            <Dropdown
                value={priority}
                options={PRIORITY_DROPDOWN}
                onChange={setPriority}
                placeholder="Choose priority"
            />

            <input
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(formatCategory(e.target.value))}
            />

            <input
                type="date"
                min={today}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
            />

            {/* =========================
               IMAGE HANDLER
            ========================= */}
            <TaskImages
                oldImages={oldImages}
                newImages={newImages}
                isEditing={true}
                onRemoveOld={(img) => setOldImages((prev) => prev.filter((i) => i !== img))}
                onRemoveNew={removeNewImage}
                onPreview={() => { }}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onNewImages={handleNewImages}
            />

            <button type="submit" disabled={!canSubmit}>
                Create Task
            </button>
        </form>
    );
}

export default TaskForm;
