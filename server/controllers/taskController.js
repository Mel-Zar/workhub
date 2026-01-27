const Task = require("../models/Task");

// GET all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error("Error getting tasks:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// CREATE a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, priority, deadline } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const task = new Task({
            title,
            description,
            priority,
            deadline,
            user: req.user.id
        });

        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// UPDATE a task
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, deadline, completed } = req.body;

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority = priority;
        if (deadline !== undefined) task.deadline = deadline;
        if (completed !== undefined) task.completed = completed;

        await task.save();
        res.json(task);
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// DELETE a task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// TOGGLE COMPLETE
exports.toggleComplete = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ error: "Task not found" });

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        task.completed = !task.completed;
        await task.save();

        res.json(task);
    } catch (err) {
        console.error("Error toggling task:", err);
        res.status(500).json({ error: "Server error" });
    }
};
