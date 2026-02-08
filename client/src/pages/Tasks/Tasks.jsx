import { useNavigate } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../context/AuthContext";

import TaskItem from "../../components/TaskItem/TaskItem";
import TaskSearch from "../../components/TaskSearch/TaskSearch";
import TaskFilters from "../../components/TaskFilters/TaskFilters";
import TaskSort from "../../components/TaskSort/TaskSort";

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

    if (authLoading) return <p>Laddar användare...</p>;
    if (!user) return <p>Ej inloggad</p>;

    return (
        <div>
            <h2>Tasks</h2>

            <TaskSort onSortChange={(value) => { setPage(1); setSortBy(value); }} />

            <TaskSearch onSearch={(value) => { setPage(1); setFilters(prev => ({ ...prev, search: value })); }} />

            <TaskFilters
                filters={filters}
                onChange={(data) => { setPage(1); setFilters(data); }}
                categories={categories}
                priorities={priorities}
                completionOptions={completionOptions}
            />

            {loading && <p>Laddar...</p>}
            {error && <p style={{ color: "red" }}>Fel: {error}</p>}
            {!loading && !error && tasks.length === 0 && <p>Inga tasks</p>}

            {tasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    showActions={false}
                    editable={false}
                    onClick={() => navigate(`/task/${task._id}`)}
                />
            ))}

            {pages > 1 && (
                <div style={{ marginTop: 20 }}>
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>⬅ Föregående</button>
                    <span style={{ margin: "0 10px" }}>Sida {page} av {pages}</span>
                    <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Nästa ➡</button>
                </div>
            )}
        </div>
    );
}

export default Tasks;
