import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/ApiFetch";

function Task() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [error, setError] = useState("");

    // ================= FETCH SINGLE TASK =================
    async function fetchTask() {
        try {

            const res = await apiFetch(`http://localhost:5001/api/tasks/${id}`);

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Kunde inte hämta task");
                return;
            }

            setTask(data.task);

        } catch (err) {
            console.error(err);
            setError("Serverfel");
        }
    }

    // ================= LOAD =================
    useEffect(() => {
        fetchTask();
    }, [id]);

    // ================= STATES =================
    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!task) {
        return <p>Laddar task...</p>;
    }

    // ================= RENDER =================
    return (
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>

            <h2>{task.title}</h2>

            <p><strong>Description:</strong> {task.description || "Ingen beskrivning"}</p>
            <p><strong>Kategori:</strong> {task.category || "Ingen"}</p>
            <p><strong>Prioritet:</strong> {task.priority || "Ingen"}</p>

            <p>
                <strong>Deadline:</strong>{" "}
                {task.deadline
                    ? new Date(task.deadline).toLocaleDateString()
                    : "Ingen"}
            </p>

            <p>
                <strong>Status:</strong>{" "}
                {task.completed ? "Klar" : "Ej klar"}
            </p>

            <div style={{ marginTop: "20px" }}>
                <button onClick={() => navigate(-1)}>
                    Tillbaka till tasks
                </button>
            </div>

        </div>
    );
}

export default Task;
