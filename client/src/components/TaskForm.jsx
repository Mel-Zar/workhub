import { useState } from "react";
import { apiFetch } from "../api/ApiFetch";

function TaskForm({ onCreate }) {

    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("medium");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");
    const [error, setError] = useState("");

    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);

    // ================= FORMAT INPUT =================

    function formatInput(value, maxLength = 40) {
        let v = value.replace(/[^a-zA-ZåäöÅÄÖ0-9 ]/g, "");
        v = v.replace(/\s+/g, " ");
        v = v.trimStart();

        if (v.length > 0)
            v = v.charAt(0).toUpperCase() + v.slice(1);

        return v.slice(0, maxLength);
    }

    function formatCategory(value) {
        let v = value.replace(/[^A-Za-zÅÄÖåäö]/g, "");
        v = v.slice(0, 20);

        if (v.length === 0) return "";
        return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
    }

    // ================= IMAGES =================

    function handleImages(e) {
        const files = Array.from(e.target.files);
        setImages(files);

        const previews = files.map(file =>
            URL.createObjectURL(file)
        );
        setPreview(previews);
    }

    // ================= SUBMIT =================
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("priority", priority);
        formData.append("category", category);
        formData.append("deadline", deadline);

        images.forEach(img => {
            formData.append("images", img);
        });

        const res = await apiFetch(
            "http://localhost:5001/api/tasks",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Kunde inte skapa task");
            return;
        }

        onCreate();

        setTitle("");
        setCategory("");
        setDeadline("");
        setImages([]);
        setPreview([]);
    }


    // ================= UI =================

    return (
        <form onSubmit={handleSubmit}>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
                placeholder="Titel"
                value={title}
                onChange={e => setTitle(formatInput(e.target.value))}
                required
            />

            <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
            >
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
                value={deadline}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setDeadline(e.target.value)}
            />

            {/* PREVIEW */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {preview.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        width="80"
                        style={{ borderRadius: "5px" }}
                    />
                ))}
            </div>

            {/* IMAGE INPUT */}
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
            />



            <button>Skapa</button>

        </form>
    );
}

export default TaskForm;
