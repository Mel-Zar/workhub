import { useEffect, useState } from "react";

function TaskFilters({ onFilter }) {

    const [search, setSearch] = useState("");
    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [completed, setCompleted] = useState("");
    const [categories, setCategories] = useState([]);

    // Hämta kategorier från DB
    useEffect(() => {
        fetch("http://localhost:5001/api/tasks/categories", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => setCategories(data));
    }, []);

    // Live-filter
    useEffect(() => {
        onFilter({ search, priority, category, completed });
    }, [search, priority, category, completed]);

    return (
        <div style={{ marginBottom: 20 }}>

            {/* SÖK */}
            <input
                placeholder="Sök..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {/* PRIORITY */}
            <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
            >
                <option value="">Alla prioriteter</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            {/* KATEGORI */}
            <select
                value={category}
                onChange={e => setCategory(e.target.value)}
            >
                {/* ALLA SKA ALLTID FINNAS */}
                <option value="">Alla kategorier</option>

                {/* ENDAST DB-KATEGORIER */}
                {categories.map(cat => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>

            {/* STATUS */}
            <select
                value={completed}
                onChange={e => setCompleted(e.target.value)}
            >
                <option value="">Alla</option>
                <option value="true">Klara</option>
                <option value="false">Ej klara</option>
            </select>

        </div>
    );
}

export default TaskFilters;
