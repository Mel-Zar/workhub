import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/ApiFetch";

function Tasks() {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");

    // ================= FETCH TASKS =================
    async function fetchTasks() {
        try {

            const res = await apiFetch("http://localhost:5001/api/tasks");

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Kunde inte hämta tasks");
                return;
            }

            setTasks(data.tasks || []);

        } catch (err) {
            console.error(err);
            setError("Serverfel");
        }
    }

    // ================= LOAD =================
    useEffect(() => {
        fetchTasks();
    }, []);

    // ================= RENDER =================
    return (
        <div>

            <h2>Mina Tasks</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {tasks.length === 0 && (
                <p>Inga tasks ännu</p>
            )}

            {tasks.map(task => (
                <div
                    key={task._id}
                    onClick={() => navigate(`/task/${task._id}`)}
                    style={{
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        padding: "10px",
                        marginBottom: "5px",
                        borderRadius: "5px"
                    }}
                >
                    <h4>{task.title}</h4>
                    <p>Status: {task.completed ? "Klar" : "Ej klar"}</p>
                </div>
            ))}

        </div>
    );
}

export default Tasks;
