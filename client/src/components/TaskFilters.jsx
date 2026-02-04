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

    // Remove empty + duplicates
    const cleanCategories = useMemo(() => {
        return [...new Set(categories.filter(Boolean))];
    }, [categories]);

    const cleanPriorities = useMemo(() => {
        return [...new Set(priorities.filter(Boolean))];
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

        onFilter({
            priority: updated.priority || undefined,
            category: updated.category || undefined,
            completed: updated.completed || undefined,
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
                onChange={(e) => {
                    setPriority(e.target.value);
                    triggerFilter({ priority: e.target.value });
                }}
            >
                <option value="">Alla prioriteter</option>
                {cleanPriorities.map((p) => (
                    <option key={p} value={p}>
                        {p}
                    </option>
                ))}
            </select>

            {/* CATEGORY */}
            <select
                value={category}
                onChange={(e) => {
                    setCategory(e.target.value);
                    triggerFilter({ category: e.target.value });
                }}
            >
                <option value="">Alla kategorier</option>
                {cleanCategories.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
            </select>

            {/* COMPLETED */}
            <select
                value={completed}
                onChange={(e) => {
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

            {/* FROM DATE */}
            <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                    setFromDate(e.target.value);
                    triggerFilter({ fromDate: e.target.value });
                }}
            />

            {/* TO DATE */}
            <input
                type="date"
                value={toDate}
                onChange={(e) => {
                    setToDate(e.target.value);
                    triggerFilter({ toDate: e.target.value });
                }}
            />

            {/* RESET */}
            <button onClick={handleReset}>🔄 Rensa</button>
        </div>
    );
}

export default TaskFilters;
