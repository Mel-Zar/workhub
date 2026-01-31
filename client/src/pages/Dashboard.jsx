import { useEffect, useState, useContext } from "react";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import TaskFilters from "../components/TaskFilters";
import { AuthContext } from "../AuthContext";

function Dashboard() {

    const { getValidAccessToken, logout } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({});
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    // ================= FETCH TASKS =================
    const fetchTasks = async (filterData = {}) => {
        try {
            setFilters(filterData);

            const token = await getValidAccessToken();
            if (!token) {
                logout();
                return;
            }

            const params = new URLSearchParams(filterData);

            const res = await fetch(
                `http://localhost:5001/api/tasks?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Kunde inte hämta tasks");
                return;
            }

            setTasks(data.tasks || []);

            const uniqueCategories = [
                ...new Set((data.tasks || [])
                    .map(t => t.category)
                    .filter(Boolean))
            ];

            setCategories(uniqueCategories);

        } catch (err) {
            console.error(err);
            setError("Serverfel");
        }
    };

    // ================= FIRST LOAD =================
    useEffect(() => {
        fetchTasks();
    }, []);

    // ================= CREATE =================
    const addTask = (task) => {
        setTasks(prev => [task, ...prev]);
    };

    // ================= UPDATE =================
    const updateTask = (updated) => {
        setTasks(prev =>
            prev.map(t => t._id === updated._id ? updated : t)
        );
    };

    // ================= DELETE =================
    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t._id !== id));
    };

    return (
        <div>

            <h2>Dashboard</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

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
                    onDelete={deleteTask}
                />
            ))}

        </div>
    );
}

export default Dashboard;
