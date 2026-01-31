import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Tasks() {
    const { accessToken, refreshAccessToken, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");

    const fetchTasks = async () => {
        try {
            let token = accessToken;

            let res = await fetch("http://localhost:5001/api/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 401) {
                token = await refreshAccessToken();
                if (!token) { logout(); return; }

                res = await fetch("http://localhost:5001/api/tasks", {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            const data = await res.json();
            if (!res.ok) { setError(data.error || "Kunde inte hämta tasks"); return; }

            setTasks(data.tasks || []);
        } catch (err) {
            console.error(err);
            setError("Serverfel");
        }
    };

    useEffect(() => {
        if (accessToken) fetchTasks();
    }, [accessToken]);

    return (
        <div>
            <h2>Mina Tasks</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {tasks.length === 0 && <p>Inga tasks ännu</p>}

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
