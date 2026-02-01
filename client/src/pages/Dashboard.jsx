import { useEffect, useState } from "react";
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

    // ================= FETCH TASKS =================
    async function fetchTasks() {
        try {
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

            const res = await apiFetch(
                `http://localhost:5001/api/tasks?${params}`
            );

            const data = await res.json();

            setTasks(data.tasks || []);
            setPages(data.pages || 1);

            setCategories([
                ...new Set(
                    (data.tasks || [])
                        .map(t => t.category)
                        .filter(Boolean)
                )
            ]);

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, [page, filters, sortBy]);

    // ================= CALLBACKS =================
    function handleUpdate(updatedTask) {
        setTasks(prev =>
            prev.map(t =>
                t._id === updatedTask._id ? updatedTask : t
            )
        );
    }

    function handleDelete(id) {
        setTasks(prev =>
            prev.filter(t => t._id !== id)
        );
    }

    // ================= RENDER =================
    return (
        <div>

            <h2>Dashboard</h2>

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
                categories={categories}
                onFilter={(data) => {
                    setPage(1);
                    setFilters(prev => ({ ...prev, ...data }));
                }}
            />

            <TaskForm onCreate={fetchTasks} />

            {tasks.length === 0 && <p>Inga tasks</p>}

            {tasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    showActions={true}
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

export default Dashboard;
