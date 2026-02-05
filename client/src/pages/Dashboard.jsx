import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../api/ApiFetch";

import TaskFilters from "../components/TaskFilters";
import TaskSearch from "../components/TaskSearch";
import TaskSort from "../components/TaskSort";
import TaskItem from "../components/TaskItem";

function Dashboard() {

    // ALL TASKS
    const [tasks, setTasks] = useState([]);

    // FILTER STATE
    const [filters, setFilters] = useState({
        search: "",
        priority: "",
        category: "",
        completed: "",
        fromDate: "",
        toDate: ""
    });

    const [sortBy, setSortBy] = useState("");

    // FETCH ONCE
    useEffect(() => {
        async function fetchAll() {
            const res = await apiFetch("/api/tasks?limit=10000");
            const data = await res.json();
            setTasks(data.tasks || []);
        }
        fetchAll();
    }, []);

    // FILTERING
    const filteredTasks = useMemo(() => {
        return tasks.filter(t => {

            if (
                filters.search &&
                !t.title.toLowerCase().includes(filters.search.toLowerCase())
            ) return false;

            if (filters.priority && t.priority !== filters.priority)
                return false;

            if (filters.category && t.category !== filters.category)
                return false;

            if (
                filters.completed !== "" &&
                String(t.completed) !== filters.completed
            ) return false;

            if (filters.fromDate && t.deadline) {
                if (new Date(t.deadline) < new Date(filters.fromDate))
                    return false;
            }

            if (filters.toDate && t.deadline) {
                if (new Date(t.deadline) > new Date(filters.toDate))
                    return false;
            }

            return true;
        });
    }, [tasks, filters]);

    // CASCADE OPTIONS
    const categories = useMemo(() =>
        [...new Set(filteredTasks.map(t => t.category))],
        [filteredTasks]
    );

    const priorities = useMemo(() =>
        [...new Set(filteredTasks.map(t => t.priority))],
        [filteredTasks]
    );

    const completionOptions = useMemo(() => {
        const arr = [];
        if (filteredTasks.some(t => t.completed)) arr.push("true");
        if (filteredTasks.some(t => !t.completed)) arr.push("false");
        return arr;
    }, [filteredTasks]);

    // SORT
    const sortedTasks = useMemo(() => {
        const copy = [...filteredTasks];

        if (sortBy === "deadline")
            return copy.sort((a, b) =>
                new Date(a.deadline || 0) - new Date(b.deadline || 0)
            );

        if (sortBy === "priority")
            return copy.sort((a, b) =>
                a.priority.localeCompare(b.priority)
            );

        if (sortBy === "title")
            return copy.sort((a, b) =>
                a.title.localeCompare(b.title)
            );

        return copy;
    }, [filteredTasks, sortBy]);

    return (
        <div>

            <TaskSort onSortChange={setSortBy} />

            <TaskSearch
                onSearch={value =>
                    setFilters(prev => ({ ...prev, search: value }))
                }
            />

            <TaskFilters
                filters={filters}
                onChange={setFilters}
                categories={categories}
                priorities={priorities}
                completionOptions={completionOptions}
            />

            {sortedTasks.length === 0 && <p>Inga tasks</p>}

            {sortedTasks.map(task => (
                <TaskItem key={task._id} task={task} />
            ))}

        </div>
    );
}

export default Dashboard;
