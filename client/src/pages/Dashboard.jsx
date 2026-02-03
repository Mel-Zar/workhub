import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { apiFetch } from "../api/ApiFetch";

import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import TaskFilters from "../components/TaskFilters";
import TaskSearch from "../components/TaskSearch";
import TaskSort from "../components/TaskSort";

function Dashboard() {

    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState("deadline");

    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // ================= FETCH TASKS =================
    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);

            const formatText = str =>
                str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

            const formatCategory = str => {
                if (!str) return "";
                const first = str.split(/\s+/)[0];
                return formatText(first);
            };

            const params = new URLSearchParams({
                page,
                limit: 5,
                sortBy
            });

            if (filters.search) params.append("search", filters.search);
            if (filters.priority) params.append("priority", filters.priority);
            if (filters.category) params.append("category", filters.category);
            if (filters.completed !== undefined)
                params.append("completed", filters.completed);

            const res = await apiFetch(`/api/tasks?${params}`);

            if (!res.ok) throw new Error("Fetch failed");

            const data = await res.json();

            const formattedTasks = (data.tasks || []).map(task => ({
                ...task,
                title: formatText(task.title),
                category: formatCategory(task.category),
                priority: formatText(task.priority)
            }));

            setTasks(formattedTasks);
            setPages(data.pages || 1);

            setCategories([
                ...new Set(formattedTasks.map(t => t.category).filter(Boolean))
            ]);

        } catch (err) {
            console.error(err);
            toast.error("Kunde inte hämta tasks");
        } finally {
            setLoading(false);
        }
    }, [page, filters, sortBy]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // ================= CALLBACKS =================
    function handleUpdate(updatedTask) {
        setTasks(prev =>
            prev.map(t => (t._id === updatedTask._id ? updatedTask : t))
        );
    }

    function handleDelete(id) {
        setTasks(prev => prev.filter(t => t._id !== id));
    }

    // ================= RENDER =================
    return (
        <div>

            <h2>Dashboard</h2>

            <TaskSort
                sortBy={sortBy}
                onSortChange={value => {
                    setPage(1);
                    setSortBy(value);
                }}
            />

            <TaskSearch
                onSearch={value => {
                    setPage(1);
                    setFilters(prev => ({ ...prev, search: value }));
                }}
            />

            <TaskFilters
                categories={categories}
                onFilter={data => {
                    setPage(1);
                    setFilters(prev => ({ ...prev, ...data }));
                }}
            />

            <TaskForm onCreate={fetchTasks} />

            {loading && <p>Laddar...</p>}
            {!loading && tasks.length === 0 && <p>Inga tasks</p>}

            {!loading && tasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    showActions
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

export default Dashboard;
