import { useState } from "react";

function TaskSearch({ onSearch }) {
    const [search, setSearch] = useState("");

    return (
        <input
            type="text"
            placeholder="Sök tasks..."
            value={search}
            onChange={e => {
                setSearch(e.target.value);
                onSearch(e.target.value);
            }}
        />
    );
}

export default TaskSearch;
