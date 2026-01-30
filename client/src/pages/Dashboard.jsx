import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import TaskFilters from "../components/TaskFilters";


function Dashboard() {

    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({});
    const [error, setError] = useState("");

    // ================= FETCH TASKS =================
    const fetchTasks = async (activeFilters = {}) => {
        try {
            const params = new URLSearchParams(activeFilters).toString();

            const res = await fetch(
                `http://localhost:5001/api/tasks?${params}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await res.json();
            console.log("TASK RESPONSE:", data);

            if (!res.ok) {
                setError(data.error || "Kunde inte hämta tasks");
                setTasks([]);
                return;
            }

            setTasks(Array.isArray(data.tasks) ? data.tasks : []);

        } catch (err) {
            console.error("FETCH ERROR:", err);
            setError("Serverfel");
            setTasks([]);
        }
    };


    // ================= ON LOAD =================
    useEffect(() => {
        fetchTasks();
    }, []);

    // ================= CREATE =================
    const addTask = () => {
        fetchTasks(filters);
    };

    // ================= UPDATE =================
    const updateTask = (updatedTask) => {
        setTasks(prev =>
            prev.map(t => t._id === updatedTask._id ? updatedTask : t)
        );
    };

    const handleFilter = (newFilters) => {
        setFilters(newFilters);
        fetchTasks(newFilters);
    };

    return (
        <div>
            <h2>Dashboard</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <TaskForm onCreate={addTask} />


            <TaskFilters onFilter={handleFilter} />

            {tasks.length === 0 && <p>Inga tasks ännu</p>}

            {tasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    onUpdate={updateTask}
                />
            ))}
        </div>
    );
}

export default Dashboard;
