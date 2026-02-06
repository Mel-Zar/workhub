import { useTasks } from "../hooks/useTasks";

import TaskItem from "../components/TaskItem";
import TaskSearch from "../components/TaskSearch";
import TaskFilters from "../components/TaskFilters";
import TaskSort from "../components/TaskSort";
import TaskForm from "../components/TaskForm";

function Dashboard() {

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
        setSortBy,
        refreshTasks,
        setAllTasks
    } = useTasks({ limit: 5 });

    return (
        <div>

            <h2>Dashboard</h2>

            <TaskForm onCreate={refreshTasks} />

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
                    showActions
                    editable
                    onUpdate={(t) =>
                        setAllTasks(prev =>
                            prev.map(x => x._id === t._id ? t : x)
                        )
                    }
                    onDelete={(id) =>
                        setAllTasks(prev =>
                            prev.filter(x => x._id !== id)
                        )
                    }
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

export default Dashboard;
