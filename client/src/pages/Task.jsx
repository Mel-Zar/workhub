import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/ApiFetch";

function Task() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ================= USE EFFECT =================
    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await apiFetch(
                    `http://localhost:5001/api/tasks/${id}`
                );

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Kunde inte hämta task");
                    return;
                }

                setTask(data);

            } catch (err) {
                console.error(err);
                setError("Serverfel");
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    // ================= STATES =================
    if (loading) return <p>Laddar task...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!task) return null;

    // ================= RENDER =================
    return (
        <div style={{ padding: "20px" }}>

            <h2>{task.title}</h2>

            <p><strong>Kategori:</strong> {task.category || "Ingen"}</p>
            <p><strong>Prioritet:</strong> {task.priority}</p>

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

            {/* ===== IMAGE GALLERY ===== */}
            {task.images?.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "15px",
                        flexWrap: "wrap"
                    }}
                >
                    {task.images.map((img, i) => (
                        <img
                            key={i}
                            src={`http://localhost:5001${img}`}
                            alt="task"
                            width="150"
                            style={{
                                borderRadius: "8px",
                                objectFit: "cover"
                            }}
                        />
                    ))}
                </div>
            )}

            <br />

            <button onClick={() => navigate(-1)}>
                Tillbaka
            </button>

        </div>
    );
}

export default Task;
