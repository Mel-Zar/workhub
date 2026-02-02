import { useState } from "react";
import { apiFetch } from "../api/ApiFetch";
import { toast } from "react-toastify";

function TaskForm({ onCreate }) {

    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");
    const [images, setImages] = useState([]);

    const isFormValid =
        title && priority && category && deadline && images.length > 0;

    async function handleSubmit(e) {
        e.preventDefault();
        if (!isFormValid) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("priority", priority);
        formData.append("category", category);
        formData.append("deadline", deadline);
        images.forEach(i => formData.append("images", i));

        const res = await apiFetch("http://localhost:5001/api/tasks", {
            method: "POST",
            body: formData
        });

        if (res.ok) {
            toast.success("Task skapad!");
            setTitle(""); setPriority(""); setCategory(""); setDeadline(""); setImages([]);
            onCreate();
        } else {
            toast.error("Kunde inte skapa task");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>Skapa Task</h3>

            <input placeholder="Titel" value={title} onChange={e => setTitle(e.target.value)} />
            <select value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="">Välj prioritet</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <input placeholder="Kategori" value={category} onChange={e => setCategory(e.target.value)} />
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
            <input type="file" multiple onChange={e => setImages([...e.target.files])} />

            <button disabled={!isFormValid}>
                Skapa Task
            </button>
        </form>
    );
}

export default TaskForm;
