import { useEffect, useMemo, useState, useCallback } from "react";
import { taskService } from "../services/taskService";
import { useAuth } from "../context/AuthContext";

export function useTasks({ limit = 5 } = {}) {
    const { user, loading: authLoading } = useAuth();
    const [allTasks, setAllTasks] = useState([]);
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 🔹 Fetch tasks
    const refreshTasks = useCallback(async () => {
        const token = localStorage.getItem("accessToken");
        if (!user || !token) return; // Vänta tills token finns

        try {
            setLoading(true);
            setError(null);

            const data = await taskService.getAll(); // apiFetch skickar token
            const tasks = Array.isArray(data)
                ? data
                : Array.isArray(data.tasks)
                    ? data.tasks
                    : [];

            setAllTasks(tasks);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "Could not load tasks");
            setAllTasks([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // 🔹 Hämta tasks när auth är redo
    useEffect(() => {
        if (authLoading) return;
        if (!user) return;
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        refreshTasks();
    }, [authLoading, user, refreshTasks]);

    // 🔹 Filter
    const filteredTasks = useMemo(
        () =>
            allTasks.filter((t) => {
                if (filters.search && !t.title?.toLowerCase().includes(filters.search.toLowerCase())) return false;
                if (filters.priority && t.priority !== filters.priority) return false;
                if (filters.category && t.category !== filters.category) return false;
                if (filters.completed !== "" && String(t.completed) !== filters.completed) return false;
                if (filters.fromDate && t.deadline && new Date(t.deadline) < new Date(filters.fromDate)) return false;
                if (filters.toDate && t.deadline && new Date(t.deadline) > new Date(filters.toDate)) return false;
                return true;
            }),
        [allTasks, filters]
    );

    // 🔹 Sort
    const sortedTasks = useMemo(() => {
        const copy = [...filteredTasks];
        if (sortBy === "deadline") return copy.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0));
        if (sortBy === "priority") return copy.sort((a, b) => a.priority.localeCompare(b.priority));
        if (sortBy === "title") return copy.sort((a, b) => a.title.localeCompare(b.title));
        return copy;
    }, [filteredTasks, sortBy]);

    // 🔹 Pagination
    const pages = Math.ceil(sortedTasks.length / limit);
    const paginatedTasks = sortedTasks.slice((page - 1) * limit, page * limit);

    // 🔹 Options
    const categories = useMemo(() => [...new Set(filteredTasks.map((t) => t.category).filter(Boolean))], [filteredTasks]);
    const priorities = useMemo(() => [...new Set(filteredTasks.map((t) => t.priority).filter(Boolean))], [filteredTasks]);
    const completionOptions = useMemo(() => {
        const arr = [];
        if (filteredTasks.some((t) => t.completed)) arr.push("true");
        if (filteredTasks.some((t) => !t.completed)) arr.push("false");
        return arr;
    }, [filteredTasks]);

    return {
        tasks: paginatedTasks,
        loading,
        error,
        page,
        pages,
        filters,
        categories,
        priorities,
        completionOptions,
        setPage,
        setFilters,
        setSortBy,
        refreshTasks,
        setAllTasks
    };
}
