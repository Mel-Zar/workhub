import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { taskService } from "../../services/taskService";
import { toast } from "react-toastify";
import "./Task.scss";

function Task() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        async function fetchTask() {

            setLoading(true);

            try {

                const data = await taskService.getById(id);

                setTask(data);

            } catch {

                toast.error("Kunde inte hämta task");

            } finally {

                setLoading(false);

            }

        }

        fetchTask();

    }, [id]);


    if (loading) return <p className="container">Laddar...</p>;

    if (!task) return <p className="container">Task hittades inte</p>;


    return (

        <main className="task-page">

            <div className="task-container">

                <div className="task-card">

                    <header className="task-header">

                        <h1>{task.title}</h1>

                        <button
                            className="back-btn"
                            onClick={() => navigate(-1)}
                        >
                            ← Back
                        </button>

                    </header>


                    <div className="task-details">


                        <div className="detail-row">

                            <span className="label">Priority:</span>

                            <span className={`badge priority ${task.priority}`}>
                                {task.priority}
                            </span>

                        </div>


                        <div className="detail-row">

                            <span className="label">Category:</span>

                            <span className="badge">
                                {task.category}
                            </span>

                        </div>


                        <div className="detail-row">

                            <span className="label">Deadline:</span>

                            <span className="badge">
                                {task.deadline?.slice(0, 10)}
                            </span>

                        </div>


                        <div className="detail-row">

                            <span className="label">Status:</span>

                            <span className={`badge ${task.completed ? "done" : ""}`}>
                                {task.completed ? "Completed" : "Active"}
                            </span>

                        </div>


                    </div>



                    {task.images?.length > 0 && (

                        <div className="task-images">

                            {task.images.map((img, i) => (

                                <img
                                    key={i}
                                    src={`${import.meta.env.VITE_API_URL}${img}`}
                                />

                            ))}

                        </div>

                    )}


                </div>

            </div>

        </main>
    );

}

export default Task;
