import React, { useEffect, useState } from "react";

function Tasks() {

    const [tasks, setTasks] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem("token");
        console.log("TOKEN I TASKS:", token);

        fetch("http://localhost:5001/api/tasks", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("Tasks from backend:", data);
                setTasks(data.tasks);   // 👈 viktiga raden

            })
            .catch(err => console.log("Error fetching tasks:", err));
    }, []);

    return (
        <div>
            <h3>Tasks</h3>
            <p>Välkommen! Du är inloggad.</p>

            <h2>Mina Tasks</h2>

            {tasks.length === 0 && <p>Inga tasks ännu</p>}

            {tasks.map(task => (
                <div key={task._id}>
                    <p>{task.title}</p>
                </div>
            ))}
        </div>
    );
}

export default Tasks;
