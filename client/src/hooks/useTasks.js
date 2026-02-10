import { useEffect, useMemo, useState, useCallback } from "react";
import { taskService } from "../services/taskService";
import { useAuth } from "../context/AuthContext/AuthContext";

export function useTasks({ limit = 5 } = {}) {
    const { user, loading: authLoading } = useAuth();

    const [allTasks, setAllTasks] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        priority: "",
        completed: undefined,
        sortBy: ""
    });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refreshTasks = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await taskService.getAll();
            setAllTasks(Array.isArray(data) ? data : data.tasks || []);
        } catch (err) {
            setError(err.message || "Failed to load tasks");
            setAllTasks([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user || authLoading) return;
        refreshTasks();
    }, [user, authLoading, refreshTasks]);

    const filteredTasks = useMemo(() => {
        return allTasks.filter(t => {
            if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
            if (filters.category && t.category !== filters.category) return false;
            if (filters.priority && t.priority !== filters.priority) return false;
            if (filters.completed !== undefined && t.completed !== filters.completed) return false;
            return true;
        });
    }, [allTasks, filters]);

    const categories = useMemo(() => [...new Set(allTasks.map(t => t.category).filter(Boolean))], [allTasks]);
    const priorities = useMemo(() => [...new Set(allTasks.map(t => t.priority).filter(Boolean))], [allTasks]);
    const completionOptions = ["true", "false"];

    const pages = Math.ceil(filteredTasks.length / limit);
    const tasks = filteredTasks.slice((page - 1) * limit, page * limit);

    return {
        tasks,
        loading,
        error,
        page,
        pages,
        filters,
        categories,
        priorities,
        completionOptions,
        setFilters,
        setPage,
        refreshTasks
    };
}
