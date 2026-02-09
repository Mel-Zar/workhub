import { useNavigate } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../context/AuthContext/AuthContext";

import TaskItem from "../../components/TaskItem/TaskItem";
import TaskControls from "../../components/TaskControl/TaskControl";
import "./Tasks.scss"

function Tasks() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

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
        setFilters,
        setSortBy
    } = useTasks({ limit: 5 });

    if (authLoading) return <p className="status-text">Laddar användare...</p>;
    if (!user) return <p className="status-text">Ej inloggad</p>;

    return (
        <div className="tasks-container">
            <header className="tasks-header">
                <h2>Mina Tasks</h2>
            </header>

            <div className="tasks-controls">
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
            </div>

            <div className="tasks-content">
                {loading && <p className="status-text">Laddar...</p>}
                {error && <p className="error-text">Fel: {error}</p>}
                {!loading && !error && tasks.length === 0 && (
                    <p className="status-text">Inga tasks</p>
                )}

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

            {pages > 1 && (
                <div className="pagination">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        ⬅ Föregående
                    </button>

                    <span>Sida {page} av {pages}</span>

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

export default Tasks;
