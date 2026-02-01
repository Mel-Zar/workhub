import { useState } from "react";
import { apiFetch } from "../api/ApiFetch";

function TaskForm({ onCreate }) {

    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("medium");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");

    // ✅ alla bilder sparas här
    const [images, setImages] = useState([]);

    // ================= ADD IMAGES =================
    function handleSelectImages(e) {

        const selected = Array.from(e.target.files);

        setImages(prev => [...prev, ...selected]);

        // reset input så man kan välja samma fil igen
        e.target.value = null;
    }

    // ================= REMOVE IMAGE =================
    function removeImage(index) {
        setImages(prev => prev.filter((_, i) => i !== index));
    }

    // ================= SUBMIT =================
    async function handleSubmit(e) {
        e.preventDefault();

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
                body: formData,
                headers: {}
            }
        );

        if (res.ok) {
            setTitle("");
            setCategory("");
            setDeadline("");
            setImages([]);
            onCreate();
        }
    }

    // ================= RENDER =================
    return (
        <form onSubmit={handleSubmit}>

            <h3>Skapa Task</h3>

            <input
                placeholder="Titel"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />

            <br />

            <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <br />

            <input
                placeholder="Kategori"
                value={category}
                onChange={e => setCategory(e.target.value)}
            />

            <br />

            <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
            />

            <br />

            {/* ✅ välj bilder hur många gånger du vill */}
            <input
                type="file"
                multiple
                onChange={handleSelectImages}
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
                        <button
                            type="button"
                            onClick={() => removeImage(i)}
                        >
                            ❌
                        </button>
                    </div>
                ))}
            </div>

            <br />

            <button>Skapa Task</button>

        </form>
    );
}

export default TaskForm;
