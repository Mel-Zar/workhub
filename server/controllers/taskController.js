const Task = require("../models/Task");

// GET all tasks with search, filtering, sorting and pagination
exports.getTasks = async (req, res) => {
    try {
        const { search, priority, completed, sortBy, order } = req.query;

        const query = {
            user: req.user.id
        };

        // 🔍 SÖK
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // 🎯 FILTER PRIORITY
        if (priority) {
            query.priority = priority;
        }

        // ✅ FILTER COMPLETED
        if (completed !== undefined) {
            query.completed = completed === "true";
        }

        // 🔃 SORTERING
        let sortOptions = {};

        if (sortBy) {
            sortOptions[sortBy] = order === "asc" ? 1 : -1;
        } else {
            sortOptions.createdAt = -1; // default
        }

        const tasks = await Task.find(query).sort(sortOptions);

        res.json(tasks);
    } catch (err) {
        console.error("Error getting tasks:", err);
        res.status(500).json({ error: "Server error" });
    }
};


// CREATE task
exports.createTask = async (req, res) => {
    try {
        const { title, description, priority, deadline, category } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const task = new Task({
            title,
            description,
            priority,
            deadline,
            category,
            user: req.user.id
        });

        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// UPDATE task
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, deadline, category } = req.body;

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (priority) task.priority = priority;
        if (deadline) task.deadline = deadline;
        if (category) task.category = category;

        await task.save();
        res.json(task);
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// DELETE task
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

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

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
