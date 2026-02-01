import { useEffect, useState } from "react";
import { apiFetch } from "../api/ApiFetch";

import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import TaskFilters from "../components/TaskFilters";
import TaskSearch from "../components/TaskSearch";
import TaskSort from "../components/TaskSort";

function Dashboard() {

    const [tasks, setTasks] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState("deadline");
    const [categories, setCategories] = useState([]);

    // ================= FETCH =================
    async function fetchTasks() {
        try {
            const res = await apiFetch("http://localhost:5001/api/tasks");
            const data = await res.json();

            const list = data.tasks || [];

            setTasks(list);
            setFiltered(list);

            setCategories([
                ...new Set(list.map(t => t.category).filter(Boolean))
            ]);

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    // ================= FILTER + SORT =================
    useEffect(() => {

        let list = [...tasks];

        if (filters.search)
            list = list.filter(t =>
                t.title.toLowerCase().includes(filters.search.toLowerCase())
            );

        if (filters.priority)
            list = list.filter(t => t.priority === filters.priority);

        if (filters.category)
            list = list.filter(t => t.category === filters.category);

        if (filters.completed !== undefined)
            list = list.filter(t => t.completed === filters.completed);

        if (filters.dateRange) {
            const from = filters.dateRange.from
                ? new Date(filters.dateRange.from)
                : null;

            const to = filters.dateRange.to
                ? new Date(filters.dateRange.to)
                : null;

            list = list.filter(t => {
                if (!t.deadline) return false;
                const d = new Date(t.deadline);
                if (from && d < from) return false;
                if (to && d > to) return false;
                return true;
            });
        }

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

        setFiltered(list);

    }, [tasks, filters, sortBy]);

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
                onSortChange={setSortBy}
            />

            <TaskSearch
                onSearch={search =>
                    setFilters(prev => ({ ...prev, search }))
                }
            />

            <TaskFilters
                categories={categories}
                onFilter={data =>
                    setFilters(prev => ({ ...prev, ...data }))
                }
            />

            <TaskForm onCreate={fetchTasks} />

            {filtered.length === 0 && <p>Inga tasks</p>}

            {filtered.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            ))}

        </div>
    );
}

export default Dashboard;
