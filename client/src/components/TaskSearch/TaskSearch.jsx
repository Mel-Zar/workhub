import "./TaskSearch.scss";

function TaskSearch({ value, onChange }) {
    return (
        <input
            className="task-search-input"
            type="text"
            placeholder="Search tasks..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

export default TaskSearch;
