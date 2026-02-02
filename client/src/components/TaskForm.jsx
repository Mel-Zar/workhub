import { useState } from "react";
import { apiFetch } from "../api/ApiFetch";

function TaskForm({ onCreate }) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("medium");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");
    const [images, setImages] = useState([]);

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

    // ================= ADD IMAGES =================
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

        const formData = new FormData();
        formData.append("title", formatText(title));
        formData.append("priority", formatText(priority));
        formData.append("category", formatCategory(category));
        formData.append("deadline", deadline);
        images.forEach(img => formData.append("images", img));

        const res = await apiFetch("http://localhost:5001/api/tasks", {
            method: "POST",
            body: formData,
            headers: {}
        });

        if (res.ok) {
            setTitle("");
            setCategory("");
            setDeadline("");
            setImages([]);
            onCreate();
        }
    }

    // ================= MIN DATE =================
    const today = new Date().toISOString().split("T")[0];

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

            <select value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <br />

            <input
                placeholder="Kategori"
                value={category}
                onChange={e => setCategory(formatCategory(e.target.value))}
            />
            <br />

            <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                min={today} // kan ej välja gamla datum
            />
            <br />

            <input type="file" multiple onChange={handleSelectImages} />

            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                {images.map((img, i) => (
                    <div key={i}>
                        <img
                            src={URL.createObjectURL(img)}
                            width="70"
                            style={{ borderRadius: "6px" }}
                        />
                        <br />
                        <button type="button" onClick={() => removeImage(i)}>❌</button>
                    </div>
                ))}
            </div>
            <br />
            <button>Skapa Task</button>
        </form>
    );
}

export default TaskForm;
