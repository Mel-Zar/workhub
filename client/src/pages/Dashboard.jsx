import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../api/ApiFetch";

import TaskFilters from "../components/TaskFilters";
import TaskSearch from "../components/TaskSearch";
import TaskSort from "../components/TaskSort";
import TaskItem from "../components/TaskItem";

function Dashboard() {

    // ================= DATA =================
    const [tasks, setTasks] = useState([]);
    const [allTasks, setAllTasks] = useState([]);

    // ================= FILTER STATE =================
    const [filters, setFilters] = useState({
        priority: "",
        category: "",
        completed: "",
        fromDate: "",
        toDate: "",
        search: ""
    });

    const [sortBy, setSortBy] = useState("");
    const [page] = useState(1);

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
        }

        fetchFiltered();

    }, [filters, sortBy, page]);

    // ================= SOURCE FOR DROPDOWNS =================
    const isFiltering =
        filters.priority ||
        filters.category ||
        filters.completed ||
        filters.fromDate ||
        filters.toDate ||
        filters.search;

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

            <TaskSort onSortChange={setSortBy} />

            <TaskSearch
                onSearch={(value) =>
                    setFilters(prev => ({ ...prev, search: value }))
                }
            />

            <TaskFilters
                categories={categories}
                priorities={priorities}
                completionOptions={completionOptions}
                onFilter={(data) =>
                    setFilters(prev => ({ ...prev, ...data }))
                }
            />

            {tasks.length === 0 && <p>Inga tasks</p>}

            {tasks.map(task => (
                <TaskItem key={task._id} task={task} />
            ))}

        </div>
    );
}

export default Dashboard;
