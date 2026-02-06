import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";

import TaskItem from "../components/TaskItem";
import TaskSearch from "../components/TaskSearch";
import TaskFilters from "../components/TaskFilters";
import TaskSort from "../components/TaskSort";

function Tasks() {

    const navigate = useNavigate();

    const {
        tasks,
        loading,
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

    return (
        <div>

            <h2>Tasks</h2>

            <TaskSort onSortChange={(value) => {
                setPage(1);
                setSortBy(value);
            }} />

            <TaskSearch onSearch={(value) => {
                setPage(1);
                setFilters(prev => ({ ...prev, search: value }));
            }} />

            <TaskFilters
                filters={filters}
                onChange={(data) => {
                    setPage(1);
                    setFilters(data);
                }}
                categories={categories}
                priorities={priorities}
                completionOptions={completionOptions}
            />

            {loading && <p>Laddar...</p>}
            {!loading && tasks.length === 0 && <p>Inga tasks</p>}

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
                    {page > 1 && <button onClick={() => setPage(p => p - 1)}>⬅ Föregående</button>}
                    <span style={{ margin: "0 10px" }}>Sida {page} av {pages}</span>
                    {page < pages && <button onClick={() => setPage(p => p + 1)}>Nästa ➡</button>}
                </div>
            )}

        </div>
    );
}

export default Tasks;
