import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

function Tasks() {

    const { accessToken, refreshAccessToken, logout } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");

    const fetchTasks = async () => {
        try {
            let token = accessToken;

            let res = await fetch("http://localhost:5001/api/tasks", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // 🔁 om token gått ut → refresh
            if (res.status === 401) {
                token = await refreshAccessToken();

                if (!token) {
                    logout();
                    return;
                }

                res = await fetch("http://localhost:5001/api/tasks", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

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
    };

    useEffect(() => {
        if (accessToken) {
            fetchTasks();
        }
    }, [accessToken]);

    return (
        <div>
            <h2>Mina Tasks</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {tasks.length === 0 && <p>Inga tasks ännu</p>}

            {tasks.map(task => (
                <div key={task._id}>
                    {task.title}
                </div>
            ))}
        </div>
    );
}

export default Tasks;
