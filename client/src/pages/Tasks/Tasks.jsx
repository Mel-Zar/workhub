import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../context/AuthContext/AuthContext";

import TaskItem from "../../components/TaskItem/TaskItem";
import TaskControls from "../../components/TaskControl/TaskControl";

import "./Tasks.scss";

function Tasks() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [view, setView] = useState("grid");

    const {
        tasks,
        loading,
        error,
        page,
        pages,
        filters,
        categories,
        priorities,
        completionOptions,
        setPage,
        setFilters
    } = useTasks({ limit: 6 });

    if (authLoading) return <p className="status-text">Loading user…</p>;
    if (!user) return <p className="status-text">Not logged in</p>;

    return (
        <div className="tasks-page">
            {/* HEADER */}
            <header className="tasks-header">
                <h2>My Tasks</h2>
                <p>Browse and manage your tasks</p>
            </header>

            {/* FILTERS + VIEW */}
            <section className="tasks-section">
                <div className="controls-header">
                    <h3 className="section-title">Filters</h3>

                    <div className="view-toggle">
                        <button
                            className={view === "list" ? "active" : ""}
                            onClick={() => setView("list")}
                        >
                            List
                        </button>
                        <button
                            className={view === "grid" ? "active" : ""}
                            onClick={() => setView("grid")}
                        >
                            Grid
                        </button>
                    </div>
                </div>

                <TaskControls
                    filters={filters}
                    setFilters={(data) => {
                        setPage(1);
                        setFilters(data);
                    }}
                    categories={categories}
                    priorities={priorities}
                    completionOptions={completionOptions}
                    onSearch={(value) =>
                        setFilters(prev => ({ ...prev, search: value }))
                    }
                />
            </section>

            {/* TASKS */}
            <section className="tasks-section">
                {loading && <p className="status-text">Loading tasks…</p>}
                {error && <p className="error-text">{error}</p>}

                <div className={`tasks-wrapper ${view}`}>
                    {tasks.map(task => (
                        <TaskItem
                            key={task._id}
                            task={task}
                            showActions={false}
                            editable={false}
                            onClick={() => navigate(`/task/${task._id}`)}
                        />
                    ))}
                </div>
            </section>

            {/* PAGINATION */}
            {pages > 1 && (
                <div className="pagination">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Prev
                    </button>

                    <span>{page} / {pages}</span>

                    <button
                        disabled={page >= pages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default Tasks;
