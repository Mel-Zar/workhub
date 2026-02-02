import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/ApiFetch";

import TaskItem from "../components/TaskItem";
import TaskSearch from "../components/TaskSearch";
import TaskFilters from "../components/TaskFilters";
import TaskSort from "../components/TaskSort";

/* ================= FORMATTERS ================= */
function formatText(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatCategory(str) {
    if (!str) return "";
    const first = str.split(/\s+/)[0];
    return formatText(first);
}

function Tasks() {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]); // ✅ NY
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState("createdAt");
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ================= FETCH TASKS =================
    useEffect(() => {

        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams({
                    page,
                    limit: 5,
                    sortBy
                });

                if (filters.search)
                    params.append("search", filters.search);

                if (filters.priority)
                    params.append("priority", filters.priority);

                if (filters.completed !== undefined)
                    params.append("completed", filters.completed);

                if (filters.category)
                    params.append("category", filters.category);

                const res = await apiFetch(`/api/tasks?${params}`);

                if (!res.ok)
                    throw new Error("Fetch failed");

                const data = await res.json();

                const formatted = (data.tasks || []).map(task => ({
                    ...task,
                    title: formatText(task.title),
                    category: formatCategory(task.category),
                    priority: formatText(task.priority)
                }));

                setTasks(formatted);
                setPages(data.pages || 1);

                // ✅ BYGG KATEGORIER
                const uniqueCategories = [
                    ...new Set(formatted.map(t => t.category).filter(Boolean))
                ];
                setCategories(uniqueCategories);

            } catch (err) {
                console.error(err);
                setError("Kunde inte hämta tasks");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();

    }, [page, filters, sortBy]);

    // ================= RENDER =================
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

            {/* ✅ SKICKA KATEGORIER */}
            <TaskFilters
                categories={categories}
                onFilter={data => {
                    setPage(1);
                    setFilters(p => ({ ...p, ...data }));
                }}
            />

            {loading && <p>Laddar tasks...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && tasks.length === 0 && <p>Inga tasks</p>}

            {!loading && !error && tasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    clickable
                    showActions={false}
                    onClick={() => navigate(`/task/${task._id}`)}
                />
            ))}

            {/* PAGINATION */}
            <div style={{ marginTop: 20 }}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    ⬅ Föregående
                </button>

                <span style={{ margin: "0 10px" }}>
                    Sida {page} av {pages}
                </span>

                <button disabled={page === pages} onClick={() => setPage(p => p + 1)}>
                    Nästa ➡
                </button>
            </div>

        </div>
    );
}

export default Tasks;
