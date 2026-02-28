import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { taskService } from "../services/taskService";
import { useAuth } from "../context/AuthContext/AuthContext";

export function useTasks({ limit } = {}) {

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

    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const timeout = setTimeout(() => {

            // Tillåt tom sträng direkt
            if (filters.search === "") {
                setDebouncedSearch("");
                setPage(1);
                return;
            }

            // Vänta tills minst 2 tecken
            if (filters.search.length < 2) return;

            setDebouncedSearch(filters.search);
            setPage(1);

        }, 400);

        return () => clearTimeout(timeout);
    }, [filters.search]);

    useEffect(() => {
        setPage(1);
    }, [filters.category, filters.priority, filters.completed, filters.sortBy]);


    const abortControllerRef = useRef(null);

    const refreshTasks = useCallback(async () => {

        if (!user || authLoading) return;

        // 🛑 Avbryt tidigare request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            setLoading(true);
            setError(null);

            const data = await taskService.getAll(
                {
                    page,
                    ...(limit && { limit }),
                    ...(debouncedSearch && { search: debouncedSearch }),
                    ...(filters.category && { category: filters.category }),
                    ...(filters.priority && { priority: filters.priority }),
                    ...(filters.completed !== undefined && { completed: filters.completed }),
                    ...(filters.sortBy && { sortBy: filters.sortBy })
                },
                controller.signal // 👈 viktigt
            );

            setAllTasks(data.tasks);
            setPages(data.pages);

        } catch (err) {
            if (err.name === "AbortError") return;
            setError(err.message || "Failed to load tasks");
            setAllTasks([]);
        } finally {
            setLoading(false);
        }
    }, [
        user,
        page,
        authLoading,
        limit,
        debouncedSearch,
        filters.category,
        filters.priority,
        filters.completed,
        filters.sortBy
    ]);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    useEffect(() => {
        if (!user || authLoading) return;
        refreshTasks();
    }, [user, authLoading, refreshTasks]);


    const categories = useMemo(() => [...new Set(allTasks.map(t => t.category).filter(Boolean))], [allTasks]);
    const priorities = useMemo(() => [...new Set(allTasks.map(t => t.priority).filter(Boolean))], [allTasks]);
    const completionOptions = [true, false];

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
