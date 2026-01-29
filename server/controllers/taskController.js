const Task = require("../models/Task");


// HELPERS

const buildQuery = (
    userId,
    search,
    priority,
    completed,
    category,
    fromDate,
    toDate
) => {
    const query = { user: userId };

    // 🔍 Search
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ];
    }

    // 🎯 Priority filter
    if (priority) {
        query.priority = priority;
    }

    // 🗂 Category filter (case-insensitive)
    if (category) {
        query.category = { $regex: `^${category}$`, $options: "i" };
    }

    // ✅ Completed filter
    if (completed !== undefined) {
        query.completed = String(completed) === "true";
    }

    // 📅 Deadline range
    if (fromDate || toDate) {
        query.deadline = {};

        if (fromDate) {
            query.deadline.$gte = new Date(fromDate);
        }

        if (toDate) {
            query.deadline.$lte = new Date(toDate);
        }
    }

    return query;
};


const buildSortOptions = (sortBy, order) => {
    const allowedFields = ["title", "priority", "deadline", "createdAt"];

    // Default sort
    if (!sortBy || !allowedFields.includes(sortBy)) {
        return { createdAt: -1 };
    }

    return {
        [sortBy]: order === "asc" ? 1 : -1
    };
};


const buildPagination = (page, limit) => {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 5;
    const skip = (pageNumber - 1) * limitNumber;

    return { pageNumber, limitNumber, skip };
};


// GET ALL TASKS

exports.getTasks = async (req, res) => {
    try {
        const {
            search,
            priority,
            category,
            completed,
            sortBy,
            order,
            page,
            limit,
            fromDate,
            toDate
        } = req.query;

        const query = buildQuery(
            req.user.id,
            search,
            priority,
            completed,
            category,
            fromDate,
            toDate
        );

        const sortOptions = buildSortOptions(sortBy, order);
        const { pageNumber, limitNumber, skip } = buildPagination(page, limit);

        const tasks = await Task.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNumber);

        const total = await Task.countDocuments(query);

        res.json({
            page: pageNumber,
            limit: limitNumber,
            totalTasks: total,
            totalPages: Math.ceil(total / limitNumber),
            tasks
        });

    } catch (err) {
        console.error("Error getting tasks:", err);
        res.status(500).json({ error: "Server error" });
    }
};


// CREATE TASK

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


// UPDATE TASK

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, deadline, category } = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority = priority;
        if (deadline !== undefined) task.deadline = deadline;
        if (category !== undefined) task.category = category;

        await task.save();
        res.json(task);

    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ error: "Server error" });
    }
};


// DELETE TASK

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

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
