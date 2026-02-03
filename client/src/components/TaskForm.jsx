import { useState } from "react";
import { toast } from "react-toastify";
import { apiFetch } from "../api/ApiFetch";

function TaskForm({ onCreate }) {

    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");
    const [images, setImages] = useState([]);

    // ================= FORMATTERS =================
    const formatText = str =>
        str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

    const formatCategory = str => {
        if (!str) return "";
        const firstWord = str.split(/\s+/)[0];
        return formatText(firstWord);
    };

    // ================= IMAGES =================
    function handleSelectImages(e) {
        const selected = Array.from(e.target.files);
        setImages(prev => [...prev, ...selected]);
        e.target.value = null;
    }

    function removeImage(index) {
        setImages(prev => prev.filter((_, i) => i !== index));
    }

    // ================= SUBMIT =================
    async function handleSubmit(e) {
        e.preventDefault();

        if (!title || !priority || !category || !deadline || images.length === 0) {
            toast.error("Alla fält och minst en bild krävs");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", formatText(title));
            formData.append("priority", priority.toLowerCase());
            formData.append("category", formatCategory(category));
            formData.append("deadline", deadline);
            images.forEach(img => formData.append("images", img));

            const res = await apiFetch("/api/tasks", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error();

            toast.success("Task skapad ✅");

            setTitle("");
            setPriority("");
            setCategory("");
            setDeadline("");
            setImages([]);

            onCreate?.();

        } catch {
            toast.error("Kunde inte skapa task");
        }
    }

    const today = new Date().toISOString().split("T")[0];

    // ================= RENDER =================
    return (
        <form onSubmit={handleSubmit}>

            <h3>Skapa Task</h3>

            <input
                placeholder="Titel"
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
                placeholder="Kategori"
                value={category}
                onChange={e => setCategory(formatCategory(e.target.value))}
            />

            <input
                type="date"
                min={today}
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
            />

            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleSelectImages}
            />

            {/* PREVIEW */}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {images.map((img, i) => (
                    <div key={i}>
                        <img
                            src={URL.createObjectURL(img)}
                            width="70"
                        />
                        <br />
                        <button type="button" onClick={() => removeImage(i)}>❌</button>
                    </div>
                ))}
            </div>

            <button type="submit">Skapa Task</button>

        </form>
    );
}

export default TaskForm;
