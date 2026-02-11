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
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refreshTasks = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);

            const data = await taskService.getAll({
                page,
                limit,
                search: filters.search,
                category: filters.category,
                priority: filters.priority,
                completed: filters.completed
            });

            setAllTasks(data.tasks);
            setPages(data.pages);

        } catch (err) {
            setError(err.message || "Failed to load tasks");
            setAllTasks([]);
        } finally {
            setLoading(false);
        }
    }, [user, page, limit, filters]);


    useEffect(() => {
        if (!user || authLoading) return;
        refreshTasks();
    }, [user, authLoading, refreshTasks]);



    const categories = useMemo(() => [...new Set(allTasks.map(t => t.category).filter(Boolean))], [allTasks]);
    const priorities = useMemo(() => [...new Set(allTasks.map(t => t.priority).filter(Boolean))], [allTasks]);
    const completionOptions = ["true", "false"];

    return {
        tasks: allTasks,
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
