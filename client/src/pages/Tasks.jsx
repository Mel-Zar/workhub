import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/ApiFetch";

import TaskSearch from "../components/TaskSearch";
import TaskSort from "../components/TaskSort";
import TaskFilters from "../components/TaskFilters";

function Tasks() {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState("created");

    const [page, setPage] = useState(1);
    const limit = 5;
    const [pages, setPages] = useState(1);

    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    // ================= FETCH =================
    async function fetchTasks() {
        try {
            const res = await apiFetch("http://localhost:5001/api/tasks");
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Kunde inte hämta tasks");
                return;
            }

            const list = data.tasks || [];

            setTasks(list);

            setCategories([
                ...new Set(list.map(t => t.category).filter(Boolean))
            ]);

        } catch (err) {
            console.error(err);
            setError("Serverfel");
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    // ================= FILTER + SORT + PAGINATION =================
    useEffect(() => {

        let list = [...tasks];

        // 🔍 SEARCH
        if (filters.search)
            list = list.filter(t =>
                t.title.toLowerCase().includes(filters.search.toLowerCase())
            );

        // 🎯 PRIORITY
        if (filters.priority)
            list = list.filter(t => t.priority === filters.priority);

        // 📁 CATEGORY
        if (filters.category)
            list = list.filter(t => t.category === filters.category);

        // ✅ COMPLETED
        if (filters.completed !== undefined)
            list = list.filter(t => t.completed === filters.completed);

        // ↕ SORT
        if (sortBy === "title")
            list.sort((a, b) => a.title.localeCompare(b.title));

        if (sortBy === "deadline")
            list.sort((a, b) =>
                new Date(a.deadline || 0) - new Date(b.deadline || 0)
            );

        if (sortBy === "priority") {
            const order = { high: 1, medium: 2, low: 3 };
            list.sort((a, b) => order[a.priority] - order[b.priority]);
        }

        if (sortBy === "created")
            list.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

        // 📄 PAGINATION
        const totalPages = Math.ceil(list.length / limit);
        setPages(totalPages);

        const start = (page - 1) * limit;
        const end = start + limit;

        setFiltered(list.slice(start, end));

    }, [tasks, filters, sortBy, page]);

    // ================= CALLBACKS =================
    function handleSearch(search) {
        setFilters(prev => ({ ...prev, search }));
        setPage(1);
    }

    function handleFilter(data) {
        setFilters(prev => ({ ...prev, ...data }));
        setPage(1);
    }

    // ================= RENDER =================
    return (
        <div>

            <h2>Mina Tasks</h2>

            <TaskSort
                sortBy={sortBy}
                onSortChange={setSortBy}
            />

            <TaskSearch
                onSearch={handleSearch}
            />

            <TaskFilters
                categories={categories}
                onFilter={handleFilter}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            {filtered.length === 0 && (
                <p>Inga tasks hittades</p>
            )}

            {filtered.map(task => (
                <div
                    key={task._id}
                    onClick={() => navigate(`/task/${task._id}`)}
                    style={{
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        padding: "10px",
                        marginBottom: "5px",
                        borderRadius: "5px"
                    }}
                >
                    <h4>{task.title}</h4>
                    <p>Status: {task.completed ? "Klar" : "Ej klar"}</p>
                    <p>Prioritet: {task.priority}</p>
                </div>
            ))}

            {/* PAGINATION */}
            {pages > 1 && (
                <div style={{ marginTop: "20px" }}>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        ⬅ Föregående
                    </button>

                    <span style={{ margin: "0 10px" }}>
                        Sida {page} av {pages}
                    </span>

                    <button
                        disabled={page === pages}
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
