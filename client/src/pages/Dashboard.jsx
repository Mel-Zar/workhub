import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

function Dashboard() {

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5001/api/tasks", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => setTasks(data.tasks));
    }, []);

    const addTask = (task) => {
        setTasks(prev => [task, ...prev]);
    };

    const updateTask = (updated) => {
        setTasks(prev =>
            prev.map(t => t._id === updated._id ? updated : t)
        );
    };

    return (
        <div>
            <h2>Dashboard</h2>

            <TaskForm onCreate={addTask} />

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
