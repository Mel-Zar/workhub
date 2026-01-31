import { useState } from "react";

function TaskSearch({ onSearch }) {
    const [search, setSearch] = useState("");

    const handleChange = e => {
        const value = e.target.value;
        setSearch(value);
        onSearch(value); // Skickar upp till Dashboard
    };

    return (
        <input
            type="text"
            placeholder="Sök tasks..."
            value={search}
            onChange={handleChange}
        />
    );
}

export default TaskSearch;
