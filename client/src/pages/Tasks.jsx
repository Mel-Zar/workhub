import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/ApiFetch";

import TaskItem from "../components/TaskItem";
import TaskSearch from "../components/TaskSearch";
import TaskFilters from "../components/TaskFilters";
import TaskSort from "../components/TaskSort";

function Tasks() {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [completionOptions, setCompletionOptions] = useState([]);

    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState("createdAt");
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    useEffect(() => {

        async function fetchTasks() {

            const params = new URLSearchParams({
                page,
                limit: 5,
                sortBy
            });

            if (filters.search) params.append("search", filters.search);
            if (filters.priority) params.append("priority", filters.priority);
            if (filters.completed !== undefined)
                params.append("completed", filters.completed);
            if (filters.category)
                params.append("category", filters.category);

            const res = await apiFetch(`/api/tasks?${params}`);
            const data = await res.json();
            const formatted = data.tasks || [];

            setTasks(formatted);
            setPages(data.pages || 1);

            setCategories([...new Set(formatted.map(t => t.category).filter(Boolean))]);
            setPriorities([...new Set(formatted.map(t => t.priority).filter(Boolean))]);

            const comp = [];
            if (formatted.some(t => t.completed === true)) comp.push("true");
            if (formatted.some(t => t.completed === false)) comp.push("false");
            setCompletionOptions(comp);
        }

        fetchTasks();

    }, [page, filters, sortBy]);

    return (
        <div>

            <h2>Mina Tasks</h2>

            <TaskSort
                sortBy={sortBy}
                onSortChange={v => {
                    setPage(1);
                    setSortBy(v);
                }}
            />

            <TaskSearch
                onSearch={v => {
                    setPage(1);
                    setFilters(p => ({ ...p, search: v }));
                }}
            />

            <TaskFilters
                categories={categories}
                priorities={priorities}
                completionOptions={completionOptions}
                onFilter={data => {
                    setPage(1);
                    setFilters(p => ({ ...p, ...data }));
                }}
            />

            {tasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    clickable
                    showActions={false}
                    onClick={() => navigate(`/task/${task._id}`)}
                />
            ))}

            {/* ================= PAGINATION ================= */}
            {pages > 1 && (
                <div style={{ marginTop: 20 }}>

                    {page > 1 && (
                        <button onClick={() => setPage(p => p - 1)}>
                            ⬅ Föregående
                        </button>
                    )}

                    <span style={{ margin: "0 10px" }}>
                        Sida {page} av {pages}
                    </span>

                    {page < pages && tasks.length > 0 && (
                        <button onClick={() => setPage(p => p + 1)}>
                            Nästa ➡
                        </button>
                    )}

                </div>
            )}

        </div>
    );
}

export default Tasks;
