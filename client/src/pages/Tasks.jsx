import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/ApiFetch";

import TaskItem from "../components/TaskItem";
import TaskSearch from "../components/TaskSearch";
import TaskFilters from "../components/TaskFilters";
import TaskSort from "../components/TaskSort";

function Tasks() {

    const navigate = useNavigate();

    // ================= DATA =================
    const [tasks, setTasks] = useState([]);
    const [allTasks, setAllTasks] = useState([]);

    // ================= FILTER STATE =================
    const [filters, setFilters] = useState({
        search: "",
        priority: "",
        category: "",
        completed: "",
        fromDate: "",
        toDate: ""
    });

    const [sortBy, setSortBy] = useState("");
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // ================= FETCH ALL TASKS (ONCE) =================
    useEffect(() => {
        async function fetchAll() {
            const res = await apiFetch("/api/tasks?limit=10000");
            const data = await res.json();
            setAllTasks(data.tasks || []);
        }
        fetchAll();
    }, []);

    // ================= FETCH FILTERED TASKS =================
    useEffect(() => {

        async function fetchFiltered() {

            try {
                setLoading(true);

                const params = new URLSearchParams({
                    page,
                    limit: 5,
                    sortBy
                });

                Object.entries(filters).forEach(([key, value]) => {
                    if (value) params.append(key, value);
                });

                const res = await apiFetch(`/api/tasks?${params}`);
                const data = await res.json();

                setTasks(data.tasks || []);
                setPages(data.pages || 1);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchFiltered();

    }, [filters, sortBy, page]);

    // ================= SOURCE FOR DROPDOWNS =================
    const isFiltering =
        filters.search ||
        filters.priority ||
        filters.category ||
        filters.completed ||
        filters.fromDate ||
        filters.toDate;

    const sourceForFilters = isFiltering ? tasks : allTasks;

    // ================= DROPDOWN VALUES =================
    const categories = useMemo(() => {
        return [...new Set(sourceForFilters.map(t => t.category).filter(Boolean))];
    }, [sourceForFilters]);

    const priorities = useMemo(() => {
        return [...new Set(sourceForFilters.map(t => t.priority).filter(Boolean))];
    }, [sourceForFilters]);

    const completionOptions = useMemo(() => {
        const arr = [];
        if (sourceForFilters.some(t => t.completed)) arr.push("true");
        if (sourceForFilters.some(t => !t.completed)) arr.push("false");
        return arr;
    }, [sourceForFilters]);

    // ================= RENDER =================
    return (
        <div>

            <h2>Mina Tasks</h2>

            <TaskSort onSortChange={(value) => {
                setPage(1);
                setSortBy(value);
            }} />

            <TaskSearch
                onSearch={(value) => {
                    setPage(1);
                    setFilters(prev => ({ ...prev, search: value }));
                }}
            />

            <TaskFilters
                categories={categories}
                priorities={priorities}
                completionOptions={completionOptions}
                onFilter={(data) => {
                    setPage(1);
                    setFilters(prev => ({ ...prev, ...data }));
                }}
            />

            {loading && <p>Laddar...</p>}
            {!loading && tasks.length === 0 && <p>Inga tasks</p>}

            {!loading && tasks.map(task => (
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

export default Tasks;
