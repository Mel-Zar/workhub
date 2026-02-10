import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../context/AuthContext/AuthContext";

import TaskItem from "../../components/TaskItem/TaskItem";
import TaskSearch from "../../components/TaskSearch/TaskSearch";
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
        setSortBy,
        refreshTasks
    } = useTasks({ limit: 5 });

    if (authLoading) return <p>Laddar användare...</p>;
    if (!user) return <p>Ej inloggad</p>;

    return (
        <div>
            <h2>Dashboard</h2>

            {/* CREATE TASK */}
            <TaskForm onCreate={refreshTasks} />



            {/* SORT + FILTER CONTROLS (TVÅ KNAPPAR) */}
            <TaskControls
                sortBy={filters.sortBy}
                setSortBy={(value) => {
                    setPage(1);
                    setSortBy(value);
                }}
                filters={filters}
                setFilters={(data) => {
                    setPage(1);
                    setFilters(data);
                }}
                categories={categories}
                priorities={priorities}
                completionOptions={completionOptions}
            />



            {/* TASK LIST */}
            {tasksLoading && <p>Laddar tasks...</p>}
            {error && <p style={{ color: "red" }}>Fel: {error}</p>}
            {!tasksLoading && !error && tasks.length === 0 && <p>Inga tasks</p>}

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
                        ⬅ Föregående
                    </button>

                    <span style={{ margin: "0 10px" }}>
                        Sida {page} av {pages}
                    </span>

                    <button
                        disabled={page >= pages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Nästa ➡
                    </button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
