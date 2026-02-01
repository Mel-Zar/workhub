import { useEffect, useState } from "react";
import { apiFetch } from "../ApiFetch";
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

    const fetchTasks = async () => {
        const res = await apiFetch("http://localhost:5001/api/tasks");
        const data = await res.json();
        setTasks(data.tasks);
        setFiltered(data.tasks);
    };

    useEffect(() => { fetchTasks(); }, []);

    useEffect(() => {
        let list = [...tasks];

        if (filters.search)
            list = list.filter(t =>
                t.title.toLowerCase().includes(filters.search.toLowerCase())
            );

        if (sortBy === "title")
            list.sort((a, b) => a.title.localeCompare(b.title));
        if (sortBy === "deadline")
            list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        setFiltered(list);
    }, [tasks, filters, sortBy]);

    return (
        <div>
            <h2>Dashboard</h2>

            <TaskSort sortBy={sortBy} onSortChange={setSortBy} />
            <TaskSearch onSearch={s => setFilters({ search: s })} />
            <TaskFilters onFilter={setFilters} />
            <TaskForm onCreate={fetchTasks} />

            {filtered.map(t => (
                <TaskItem key={t._id} task={t} />
            ))}
        </div>
    );
}

export default Dashboard;
