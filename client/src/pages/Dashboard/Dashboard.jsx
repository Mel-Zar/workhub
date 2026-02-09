import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../context/AuthContext/AuthContext";

import TaskItem from "../../components/TaskItem/TaskItem";
import TaskControls from "../../components/TaskControl/TaskControl";
import TaskForm from "../../components/TaskForm/TaskForm";

function Dashboard() {
    const { user, loading: authLoading } = useAuth();

    const {
        tasks,
        loading: tasksLoading,
        error,
        page,
        pages,
        filters,
        categories,
        priorities,
        completionOptions,
        setPage,
        setFilters,
        refreshTasks
    } = useTasks({ limit: 5 });

    if (authLoading) return <p>Loading user...</p>;
    if (!user) return <p>Not logged in</p>;

    return (
        <div>
            <h2>Dashboard</h2>

            {/* CREATE TASK */}
            <TaskForm onCreate={refreshTasks} />

            {/* SEARCH / SORT / FILTER */}
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
                    setFilters(prev => ({
                        ...prev,
                        search: value
                    }))
                }
            />

            {/* TASK LIST */}
            {tasksLoading && <p>Loading tasks...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {!tasksLoading && !error && tasks.length === 0 && <p>No tasks</p>}

            {tasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    showActions
                    editable
                    onUpdate={refreshTasks}
                    onDelete={refreshTasks}
                />
            ))}

            {/* PAGINATION */}
            {pages > 1 && (
                <div style={{ marginTop: 20 }}>
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        ⬅ Previous
                    </button>

                    <span style={{ margin: "0 10px" }}>
                        Page {page} of {pages}
                    </span>

                    <button
                        disabled={page >= pages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next ➡
                    </button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
