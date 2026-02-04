import { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { apiFetch } from "../api/ApiFetch";

import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import TaskFilters from "../components/TaskFilters";
import TaskSearch from "../components/TaskSearch";
import TaskSort from "../components/TaskSort";

function Dashboard() {

    const [tasks, setTasks] = useState([]);

    const [categories, setCategories] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [completionOptions, setCompletionOptions] = useState([]);

    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState("createdAt");

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // ================= FETCH TASKS =================
    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);

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
            if (!res.ok) throw new Error("Fetch failed");

            const data = await res.json();
            const formatted = data.tasks || [];

            setTasks(formatted);
            setPages(data.pages || 1);

            // FILTER OPTIONS BASERAT PÅ DATA I DB
            setCategories([...new Set(formatted.map(t => t.category).filter(Boolean))]);
            setPriorities([...new Set(formatted.map(t => t.priority).filter(Boolean))]);

            const comp = [];
            if (formatted.some(t => t.completed === true)) comp.push("true");
            if (formatted.some(t => t.completed === false)) comp.push("false");
            setCompletionOptions(comp);

        } catch (err) {
            console.error(err);
            toast.error("Kunde inte hämta tasks");
        } finally {
            setLoading(false);
        }
    }, [page, filters, sortBy]);

    // ================= USE EFFECT =================
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

            <ToastContainer position="top-right" autoClose={3000} />

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

            {/* ✅ FIXAD FILTER-HANTERING */}
            <TaskFilters
                categories={categories}
                priorities={priorities}
                completionOptions={completionOptions}
                onFilter={data => {

                    // 🔥 OM RENSNING
                    if (Object.keys(data).length === 0) {
                        setPage(1);
                        setFilters({});
                        fetchTasks();      // <-- NY RAD
                        return;
                    }

                    // 🔥 VANLIG FILTER
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

            {/* PAGINATION */}
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

                    {page < pages && (
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
