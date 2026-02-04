import { useState, useMemo } from "react";

function TaskFilters({
    onFilter,
    categories = [],
    priorities = [],
    completionOptions = []
}) {

    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [completed, setCompleted] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    function formatText(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const cleanCategories = useMemo(() => {
        return [...new Set(
            categories
                .map(c => c.trim())
                .filter(Boolean)
                .map(c => formatText(c))
        )];
    }, [categories]);

    const cleanPriorities = useMemo(() => {
        return [...new Set(
            priorities
                .map(p => p.trim())
                .filter(Boolean)
                .map(p => formatText(p))
        )];
    }, [priorities]);

    function triggerFilter(changes = {}) {

        const updated = {
            priority,
            category,
            completed,
            fromDate,
            toDate,
            ...changes
        };

        const completedValue =
            updated.completed === "true"
                ? true
                : updated.completed === "false"
                    ? false
                    : undefined;

        onFilter({
            priority: updated.priority || undefined,
            category: updated.category
                ? updated.category.toLowerCase()
                : undefined,
            completed: completedValue,
            fromDate: updated.fromDate || undefined,
            toDate: updated.toDate || undefined
        });
    }

    function handleReset() {
        setPriority("");
        setCategory("");
        setCompleted("");
        setFromDate("");
        setToDate("");
        onFilter({});
    }

    return (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>

            {/* PRIORITY */}
            <select
                value={priority}
                onChange={e => {
                    setPriority(e.target.value);
                    triggerFilter({ priority: e.target.value });
                }}
            >
                <option value="">Alla prioriteter</option>
                {cleanPriorities.map(p => (
                    <option key={p} value={p.toLowerCase()}>
                        {p}
                    </option>
                ))}
            </select>

            {/* CATEGORY */}
            <select
                value={category}
                onChange={e => {
                    setCategory(e.target.value);
                    triggerFilter({ category: e.target.value });
                }}
            >
                <option value="">Alla kategorier</option>
                {cleanCategories.map(cat => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>

            {/* COMPLETED */}
            <select
                value={completed}
                onChange={e => {
                    setCompleted(e.target.value);
                    triggerFilter({ completed: e.target.value });
                }}
            >
                <option value="">Alla</option>
                {completionOptions.includes("true") && (
                    <option value="true">Klara</option>
                )}
                {completionOptions.includes("false") && (
                    <option value="false">Ej klara</option>
                )}
            </select>

            <input type="date" value={fromDate}
                onChange={e => {
                    setFromDate(e.target.value);
                    triggerFilter({ fromDate: e.target.value });
                }}
            />

            <input type="date" value={toDate}
                onChange={e => {
                    setToDate(e.target.value);
                    triggerFilter({ toDate: e.target.value });
                }}
            />

            <button type="button" onClick={handleReset}>
                🔄 Rensa filter
            </button>

        </div>
    );
}

export default TaskFilters;
