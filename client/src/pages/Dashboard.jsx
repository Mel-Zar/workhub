import { useEffect, useState, useContext } from "react";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import TaskFilters from "../components/TaskFilters";
import TaskSearch from "../components/TaskSearch";
import TaskSort from "../components/TaskSort";
import { AuthContext } from "../AuthContext";

function Dashboard() {
    const { getValidAccessToken, logout } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [filters, setFilters] = useState({});
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [sortBy, setSortBy] = useState("deadline");

    const fetchTasks = async () => {
        try {
            const token = await getValidAccessToken();
            if (!token) { logout(); return; }

            const res = await fetch("http://localhost:5001/api/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            if (!res.ok) { setError(data.error || "Kunde inte hämta tasks"); return; }

            setTasks(data.tasks || []);
            setCategories([...new Set((data.tasks || []).map(t => t.category).filter(Boolean))]);
            applyFiltersAndSort(data.tasks || [], filters, sortBy);
        } catch (err) {
            console.error(err);
            setError("Serverfel");
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    const applyFiltersAndSort = (taskList, filterData, sort) => {
        let result = [...taskList];

        if (filterData.search) result = result.filter(t => t.title.toLowerCase().includes(filterData.search.toLowerCase()));
        if (filterData.category) result = result.filter(t => t.category === filterData.category);
        if (filterData.priority) result = result.filter(t => t.priority === filterData.priority);
        if (filterData.completed !== undefined) result = result.filter(t => t.completed === filterData.completed);
        if (filterData.dateRange) {
            const from = filterData.dateRange.from ? new Date(filterData.dateRange.from) : null;
            const to = filterData.dateRange.to ? new Date(filterData.dateRange.to) : null;
            result = result.filter(t => {
                const d = t.deadline ? new Date(t.deadline) : null;
                if (!d) return false;
                if (from && d < from) return false;
                if (to && d > to) return false;
                return true;
            });
        }

        if (sort === "title") result.sort((a, b) => a.title.localeCompare(b.title));
        else if (sort === "deadline") result.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0));
        else if (sort === "priority") {
            const order = { high: 0, medium: 1, low: 2 };
            result.sort((a, b) => order[a.priority] - order[b.priority]);
        }

        setFilteredTasks(result);
    };

    const handleSortChange = sort => { setSortBy(sort); applyFiltersAndSort(tasks, filters, sort); };
    const handleFilter = filterData => { setFilters(prev => ({ ...prev, ...filterData })); applyFiltersAndSort(tasks, { ...filters, ...filterData }, sortBy); };
    const handleSearch = search => { setFilters(prev => ({ ...prev, search })); applyFiltersAndSort(tasks, { ...filters, search }, sortBy); };

    const resetFilters = () => { setFilters({}); applyFiltersAndSort(tasks, {}, sortBy); };

    const addTask = task => { const updated = [task, ...tasks]; setTasks(updated); applyFiltersAndSort(updated, filters, sortBy); };
    const updateTask = updated => { const updatedTasks = tasks.map(t => t._id === updated._id ? updated : t); setTasks(updatedTasks); applyFiltersAndSort(updatedTasks, filters, sortBy); };
    const deleteTask = id => { const updatedTasks = tasks.filter(t => t._id !== id); setTasks(updatedTasks); applyFiltersAndSort(updatedTasks, filters, sortBy); };

    return (
        <div>
            <h2>Dashboard</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Sort */}
            <TaskSort sortBy={sortBy} onSortChange={handleSortChange} />

            {/* Search */}
            <TaskSearch onSearch={handleSearch} />

            {/* Filter */}
            <TaskFilters categories={categories} onFilter={handleFilter} />

            {/* Task Form */}
            <TaskForm onCreate={addTask} />

            {filteredTasks.length === 0 ? <p>Inga tasks ännu</p> : filteredTasks.map(task => (
                <TaskItem key={task._id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
            ))}
        </div>
    );
}

export default Dashboard;
