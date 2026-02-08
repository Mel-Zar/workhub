function TaskSort({ sortBy, onSortChange }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <label>Sortera efter: </label>

            <select
                value={sortBy || ""}
                onChange={e => onSortChange(e.target.value)}
            >
                <option value="">Välj</option>
                <option value="createdAt">Skapad datum</option>
                <option value="deadline">Deadline</option>
                <option value="priority">Priority</option>
                <option value="title">Titel</option>
            </select>
        </div>
    );
}

export default TaskSort;
