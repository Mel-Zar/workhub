import { useState } from "react";
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
            alert("Alla fält inklusive minst en bild måste fyllas i.");
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

            if (!res.ok) throw new Error("Failed to create task");

            // RESET
            setTitle("");
            setPriority("");
            setCategory("");
            setDeadline("");
            setImages([]);

            onCreate();

        } catch (err) {
            console.error(err);
            alert("Något gick fel vid skapandet.");
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
                required
            />
            <br />

            <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                required
            >
                <option value="" disabled>
                    Choose priority
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <br />

            <input
                placeholder="Kategori"
                value={category}
                onChange={e => {
                    const value = e.target.value.replace(/[0-9]/g, "");
                    setCategory(formatCategory(value));
                }}
                required
            />
            <br />

            <input
                type="date"
                value={deadline}
                min={today}
                onChange={e => setDeadline(e.target.value)}
                required
            />
            <br />

            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleSelectImages}
                required={images.length === 0}
            />

            {/* PREVIEW */}
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                {images.map((img, i) => (
                    <div key={i}>
                        <img
                            src={URL.createObjectURL(img)}
                            width="70"
                            style={{ borderRadius: "6px" }}
                        />
                        <br />
                        <button type="button" onClick={() => removeImage(i)}>
                            ❌
                        </button>
                    </div>
                ))}
            </div>

            <br />
            <button type="submit">Skapa Task</button>

        </form>
    );
}

export default TaskForm;
