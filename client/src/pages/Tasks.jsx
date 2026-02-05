import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/ApiFetch";
import TaskItem from "../components/TaskItem";
import TaskSearch from "../components/TaskSearch";
import TaskFilters from "../components/TaskFilters";
import TaskSort from "../components/TaskSort";

function Tasks() {
    const navigate = useNavigate();
    const [allTasks, setAllTasks] = useState([]);
    const [filters, setFilters] = useState({ search: "", priority: "", category: "", completed: "", fromDate: "", toDate: "" });
    const [sortBy, setSortBy] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchAll() {
            setLoading(true);
            try {
                const res = await apiFetch("/api/tasks?limit=10000");
                const data = await res.json();
                setAllTasks(data.tasks || []);
            } catch (err) { console.error(err); }
            setLoading(false);
        }
        fetchAll();
    }, []);

    const filteredTasks = useMemo(() => allTasks.filter(t => {
        if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.priority && t.priority !== filters.priority) return false;
        if (filters.category && t.category !== filters.category) return false;
        if (filters.completed !== "" && String(t.completed) !== filters.completed) return false;
        if (filters.fromDate && t.deadline && new Date(t.deadline) < new Date(filters.fromDate)) return false;
        if (filters.toDate && t.deadline && new Date(t.deadline) > new Date(filters.toDate)) return false;
        return true;
    }), [allTasks, filters]);

    const sortedTasks = useMemo(() => {
        const copy = [...filteredTasks];
        if (sortBy === "deadline") return copy.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0));
        if (sortBy === "priority") return copy.sort((a, b) => a.priority.localeCompare(b.priority));
        if (sortBy === "title") return copy.sort((a, b) => a.title.localeCompare(b.title));
        return copy;
    }, [filteredTasks, sortBy]);

    const pages = Math.ceil(sortedTasks.length / limit);
    const paginatedTasks = sortedTasks.slice((page - 1) * limit, page * limit);

    return (
        <div>
            <h2>Tasks</h2>
            <TaskSort onSortChange={(value) => { setPage(1); setSortBy(value); }} />
            <TaskSearch onSearch={(value) => { setPage(1); setFilters(prev => ({ ...prev, search: value })); }} />
            <TaskFilters filters={filters} onChange={(data) => { setPage(1); setFilters(data); }} categories={[...new Set(allTasks.map(t => t.category).filter(Boolean))]} priorities={[...new Set(allTasks.map(t => t.priority).filter(Boolean))]} completionOptions={["true", "false"]} />

            {loading && <p>Laddar...</p>}
            {!loading && paginatedTasks.length === 0 && <p>Inga tasks</p>}

            {!loading && paginatedTasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    showActions={false}  // Ingen checkbox
                    editable={false}     // Ingen redigera-knapp
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
