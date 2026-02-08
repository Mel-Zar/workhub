import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { taskService } from "../../services/taskService";
import { toast } from "react-toastify";

function Task() {

    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();


    useEffect(() => {
        async function fetchTask() {
            setLoading(true);
            try {
                const data = await taskService.getById(id);
                setTask(data);
            } catch (err) {
                console.error(err);
                toast.error("Kunde inte hämta task");
            } finally {
                setLoading(false);
            }
        }
        fetchTask();
    }, [id]);

    if (loading) return <p>Laddar...</p>;
    if (!task) return <p>Task hittades inte</p>;

    return (
        <div>
            <h2>{task.title}</h2>
            <p>Priority: {task.priority}</p>
            <p>Category: {task.category}</p>
            <p>Deadline: {task.deadline?.slice(0, 10)}</p>
            <p>Status: {task.completed ? "Klar" : "Ej klar"}</p>

            {task.images?.length > 0 && (
                <div style={{ display: "flex", gap: 8 }}>
                    {task.images.map((img, i) => (
                        <img
                            key={i}
                            src={`${import.meta.env.VITE_API_URL}${img}`}
                            width="80"
                        />
                    ))}
                </div>
            )}
            <div>
                <button onClick={() => navigate(-1)}>Go back</button>

            </div>
        </div>
    );
}

export default Task;
