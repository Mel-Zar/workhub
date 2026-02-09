import { useState } from "react";
import "./TaskSearch.scss";

function TaskSearch({ onSearch }) {
    const [value, setValue] = useState("");

    return (
        <input
            className="task-search-input"
            type="text"
            placeholder="Search tasks..."
            value={value}
            onChange={e => {
                setValue(e.target.value);
                onSearch(e.target.value);
            }}
        />
    );
}

export default TaskSearch;
