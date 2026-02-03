import { useState } from "react";

function TaskFilters({ onFilter, categories = [] }) {

    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [completed, setCompleted] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

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

            // ✅ DATUM FILTER
            fromDate: updated.fromDate || undefined,
            toDate: updated.toDate || undefined
        });
    }

    return (
        <div style={{
            marginBottom: "20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px"
        }}>

            {/* PRIORITY */}
            <select
                value={priority}
                onChange={e => {
                    setPriority(e.target.value);
                    triggerFilter({ priority: e.target.value });
                }}
            >
                <option value="">Alla prioriteter</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
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

                {categories.map(cat => (
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
                <option value="true">Klara</option>
                <option value="false">Ej klara</option>
            </select>

            {/* FROM DATE */}
            <input
                type="date"
                value={fromDate}
                onChange={e => {
                    setFromDate(e.target.value);
                    triggerFilter({ fromDate: e.target.value });
                }}
            />

            {/* TO DATE */}
            <input
                type="date"
                value={toDate}
                onChange={e => {
                    setToDate(e.target.value);
                    triggerFilter({ toDate: e.target.value });
                }}
            />

        </div>
    );
}

export default TaskFilters;
