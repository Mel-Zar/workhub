import { useState } from "react";
import { toast } from "react-toastify";
import { capitalize } from "../../utils/formatters";
import { taskService } from "../../services/taskService";
import "./TaskItem.scss";

function TaskItem({
    task,
    onUpdate,
    onDelete,
    showActions = true,
    editable = false,
    onClick
}) {
    const [activeImage, setActiveImage] = useState(null);

    const toggleComplete = (e) => {
        e.stopPropagation();
        taskService
            .toggleComplete(task._id, !task.completed)
            .then(data => onUpdate?.(data))
            .catch(() => toast.error("Could not update task status"));
    };

    return (
        <>
            <article
                className="task-item"
                onClick={() => onClick && onClick()}
            >
                {/* HEADER */}
                <header className="task-header">
                    {showActions && (
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={toggleComplete}
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}

                    <h4 className="task-title">
                        {capitalize(task.title)}
                    </h4>
                </header>

                {/* META */}
                <div className="task-meta">
                    <span className={`badge priority ${task.priority}`}>
                        {capitalize(task.priority || "none")}
                    </span>

                    <span className="badge category">
                        {capitalize(task.category || "uncategorized")}
                    </span>

                    {task.deadline && (
                        <span className="badge deadline">
                            Due {task.deadline.slice(0, 10)}
                        </span>
                    )}
                </div>

                {/* IMAGES */}
                {task.images?.length > 0 && (
                    <section className="task-images">
                        {task.images.map((img, i) => (
                            <img
                                key={i}
                                src={`${import.meta.env.VITE_API_URL}${img}`}
                                alt="Task"
                                loading="lazy"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveImage(`${import.meta.env.VITE_API_URL}${img}`);
                                }}
                            />
                        ))}
                    </section>
                )}

                {/* ACTIONS */}
                {showActions && editable && (
                    <footer className="task-actions">
                        <button
                            className="danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(task._id);
                            }}
                        >
                            Delete
                        </button>
                    </footer>
                )}
            </article>

            {/* IMAGE MODAL */}
            {activeImage && (
                <div
                    className="image-modal"
                    onClick={() => setActiveImage(null)}
                >
                    <img src={activeImage} alt="Preview" />
                </div>
            )}
        </>
    );
}

export default TaskItem;
