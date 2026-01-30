import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import TaskFilters from "../components/TaskFilters";

function Dashboard() {

    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({});
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    // ================= FETCH TASKS =================
    const fetchTasks = async (filterData = {}) => {
        try {
            setFilters(filterData);

            const params = new URLSearchParams(filterData);

            const res = await fetch(
                `http://localhost:5001/api/tasks?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Kunde inte hämta tasks");
                return;
            }

            setTasks(data.tasks);

            // Skapa kategori-lista från tasks
            const uniqueCategories = [
                ...new Set(data.tasks.map(t => t.category).filter(Boolean))
            ];

            setCategories(uniqueCategories);

        } catch (err) {
            console.error(err);
            setError("Serverfel");
        }
    };

    // ================= ERROR TIMEOUT =================
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 3000); // försvinner efter 3 sek
            return () => clearTimeout(timer); // städa upp
        }
    }, [error]);

    // ================= LOAD FIRST TIME =================
    useEffect(() => {
        fetchTasks();
    }, []);

    // ================= CREATE =================
    const addTask = (task) => {
        setTasks(prev => [task, ...prev]);
        fetchTasks(filters);
    };

    // ================= UPDATE =================
    const updateTask = (updated) => {
        setTasks(prev =>
            prev.map(t => t._id === updated._id ? updated : t)
        );
    };

    return (
        <div>
            <h2>Dashboard</h2>

            {error && <p style={{ color: "red", transition: "opacity 0.3s" }}>{error}</p>}

            <TaskForm onCreate={addTask} />

            <TaskFilters
                onFilter={fetchTasks}
                categories={categories}
            />

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
