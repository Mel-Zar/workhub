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
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState("createdAt");

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    // ================= FETCH =================
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
        if (filters.category) params.append("category", filters.category);

        const res = await apiFetch(
            `http://localhost:5001/api/tasks?${params}`
        );

        const data = await res.json();

        setTasks(data.tasks || []);
        setPages(data.pages || 1);
    }

    useEffect(() => {
        fetchTasks();
    }, [page, filters, sortBy]);

    // ================= RENDER =================
    return (
        <div>

            <h2>Mina Tasks</h2>

            <TaskSort
                sortBy={sortBy}
                onSortChange={(value) => {
                    setPage(1);
                    setSortBy(value);
                }}
            />

            <TaskSearch
                onSearch={(search) => {
                    setPage(1);
                    setFilters(prev => ({ ...prev, search }));
                }}
            />

            <TaskFilters
                onFilter={(data) => {
                    setPage(1);
                    setFilters(prev => ({ ...prev, ...data }));
                }}
            />

            {tasks.length === 0 && <p>Inga tasks</p>}

            {tasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    showActions={false}
                    clickable={true}
                    onClick={() => navigate(`/task/${task._id}`)}
                />
            ))}

            {/* PAGINATION */}
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

        </div>
    );
}

export default Tasks;
