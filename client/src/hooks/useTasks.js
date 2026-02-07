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
        completed: undefined, // undefined = alla, true = klar, false = ej klar
        fromDate: "",
        toDate: ""
    });
    const [sortBy, setSortBy] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refreshTasks = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            setError(null);
            const data = await taskService.getAll();
            const tasks = Array.isArray(data) ? data : Array.isArray(data.tasks) ? data.tasks : [];
            setAllTasks(tasks);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "Could not load tasks");
            setAllTasks([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user || authLoading) return;
        refreshTasks();
    }, [authLoading, user, refreshTasks]);

    // Uppdatera task in-place
    const toggleTaskInList = (updatedTask) => {
        setAllTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
    };

    // Filtrera tasks
    const filteredTasks = useMemo(() => {
        return allTasks.filter(t => {
            if (filters.search && !t.title?.toLowerCase().includes(filters.search.toLowerCase())) return false;
            if (filters.priority && t.priority !== filters.priority) return false;
            if (filters.category && t.category !== filters.category) return false;
            if (filters.completed !== undefined && t.completed !== filters.completed) return false;
            if (filters.fromDate && t.deadline && new Date(t.deadline) < new Date(filters.fromDate)) return false;
            if (filters.toDate && t.deadline && new Date(t.deadline) > new Date(filters.toDate)) return false;
            return true;
        });
    }, [allTasks, filters]);

    // Sortering
    const sortedTasks = useMemo(() => {
        const copy = [...filteredTasks];
        if (sortBy === "deadline") return copy.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0));
        if (sortBy === "priority") return copy.sort((a, b) => a.priority.localeCompare(b.priority));
        if (sortBy === "title") return copy.sort((a, b) => a.title.localeCompare(b.title));
        return copy;
    }, [filteredTasks, sortBy]);

    const pages = Math.ceil(sortedTasks.length / limit);
    const paginatedTasks = sortedTasks.slice((page - 1) * limit, page * limit);

    // Cascading filter options baserat på current filters
    const filteredForOptions = useMemo(() => {
        return allTasks.filter(t => {
            if (filters.category && t.category !== filters.category) return false;
            if (filters.priority && t.priority !== filters.priority) return false;
            if (filters.completed !== undefined && t.completed !== filters.completed) return false;
            return true;
        });
    }, [allTasks, filters.category, filters.priority, filters.completed]);

    const categories = useMemo(() => [...new Set(allTasks.map(t => t.category).filter(Boolean))], [allTasks]);
    const priorities = useMemo(() => [...new Set(filteredForOptions.map(t => t.priority).filter(Boolean))], [filteredForOptions]);
    const completionOptions = useMemo(() => {
        const hasCompleted = filteredForOptions.some(t => t.completed);
        const hasNotCompleted = filteredForOptions.some(t => !t.completed);
        const options = [];
        if (hasCompleted) options.push("true");
        if (hasNotCompleted) options.push("false");
        return options;
    }, [filteredForOptions]);

    return {
        tasks: paginatedTasks,
        allTasks,
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
        toggleTaskInList
    };
}
