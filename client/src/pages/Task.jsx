import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/ApiFetch";

function Task() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [error, setError] = useState("");

    // ================= FORMATTER =================
    function formatText(str) {
        if (!str) return "";
        return str
            .toString()
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    // ================= FETCH TASK =================
    useEffect(() => {

        const fetchTask = async () => {
            try {
                const res = await apiFetch(`/api/tasks/${id}`);

                if (!res.ok)
                    return setError("Kunde inte hämta task");

                const data = await res.json();

                // 🔥 Formatera text direkt
                const formatted = {
                    ...data,
                    title: formatText(data.title),
                    category: formatText(data.category),
                    priority: formatText(data.priority)
                };

                setTask(formatted);

            } catch (err) {
                console.error(err);
                setError("Serverfel");
            }
        };

        fetchTask();

    }, [id]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!task) return <p>Laddar task...</p>;

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

            {task.images?.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        marginTop: 20
                    }}
                >
                    {task.images.map((img, i) => (
                        <img
                            key={i}
                            src={`http://localhost:5001${img}`}
                            alt="task"
                            width={150}
                            style={{ borderRadius: 8 }}
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
