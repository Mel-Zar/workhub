import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Task() {
    const { id } = useParams(); // task-id från URL
    const navigate = useNavigate();
    const { getValidAccessToken, logout } = useContext(AuthContext);

    const [task, setTask] = useState(null);
    const [error, setError] = useState("");

    // ================= FETCH SINGLE TASK =================
    const fetchTask = async () => {
        try {
            const token = await getValidAccessToken();
            if (!token) { logout(); return; }

            const res = await fetch(`http://localhost:5001/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

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
    };

    useEffect(() => {
        fetchTask();
    }, [id]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!task) return <p>Laddar task...</p>;

    return (
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
            <h2>{task.title}</h2>
            <p><strong>Description:</strong> {task.description || "Ingen beskrivning"}</p>
            <p><strong>Kategori:</strong> {task.category || "Ingen"}</p>
            <p><strong>Prioritet:</strong> {task.priority || "Ingen"}</p>
            <p><strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleDateString() : "Ingen"}</p>
            <p><strong>Status:</strong> {task.completed ? "Klar" : "Ej klar"}</p>

            <div style={{ marginTop: "20px" }}>
                <button onClick={() => navigate(-1)}>Tillbaka till tasks</button>
            </div>
        </div>
    );
}

export default Task;
