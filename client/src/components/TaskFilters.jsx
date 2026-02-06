function TaskFilters({ filters, onChange, categories, priorities, completionOptions }) {

    function handleChange(e) {
        const { name, value } = e.target;
        onChange({ ...filters, [name]: value });
    }

    function resetFilters() {
        onChange({
            priority: "",
            category: "",
            completed: "",
            fromDate: "",
            toDate: ""
        });
    }

    return (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select name="priority" value={filters.priority} onChange={handleChange}>
                <option value="">Alla prioriteter</option>
                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <select name="category" value={filters.category} onChange={handleChange}>
                <option value="">Alla kategorier</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select name="completed" value={filters.completed} onChange={handleChange}>
                <option value="">Alla</option>
                {completionOptions.map(v => (
                    <option key={v} value={v}>
                        {v === "true" ? "Klara" : "Ej klara"}
                    </option>
                ))}
            </select>

            <input type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} />
            <input type="date" name="toDate" value={filters.toDate} onChange={handleChange} />

            <button onClick={resetFilters}>
                Rensa filter
            </button>
        </div>
    );
}

export default TaskFilters;


