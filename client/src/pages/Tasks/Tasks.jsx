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
    } = useTasks();

    if (authLoading) return <p className="status-text">Loading user…</p>;
    if (!user) return <p className="status-text">Not logged in</p>;

    return (
        <main className="tasks-page">
            {/* PAGE HEADER */}
            <header className="page-header">
                <div className="page-header-text">
                    <h1>My Tasks</h1>
                    <p>Overview of all your tasks in one place</p>
                </div>

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
            </header>

            {/* FILTER SECTION */}
            <section className="tasks-section">
                <div className="section-header">
                    <h2>Filters & Search</h2>
                    <p>Narrow down tasks by category, status or priority</p>
                </div>

                <div className="tasks-controls">
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
                </div>
            </section>

            {/* TASK LIST */}
            <section className="tasks-section">
                <div className="section-header">
                    <h2>Your Tasks</h2>
                    <p>Click a task to view full details</p>
                </div>

                <div className="tasks-content">
                    {loading && <p className="status-text">Loading tasks…</p>}
                    {error && <p className="error-text">{error}</p>}

                    {!loading && !tasks.length && (
                        <div className="empty-state">
                            <p>No tasks found</p>
                            <span>Try adjusting your filters</span>
                        </div>
                    )}

                    <div className={`tasks-layout ${view}`}>
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
                </div>
            </section>

            {/* PAGINATION */}
            {pages > 1 && (
                <footer className="pagination">
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
                </footer>
            )}
        </main>
    );
}

export default Tasks;
