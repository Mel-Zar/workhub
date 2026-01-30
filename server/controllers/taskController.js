import Task from "../models/Task.js";

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

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ];
    }

    if (priority) query.priority = priority;

    if (category) {
        query.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (completed !== undefined) {
        query.completed = String(completed) === "true";
    }

    if (fromDate || toDate) {
        query.deadline = {};
        if (fromDate) query.deadline.$gte = new Date(fromDate);
        if (toDate) query.deadline.$lte = new Date(toDate);
    }

    return query;
};

const buildSortOptions = (sortBy, order) => {
    const allowedFields = ["title", "priority", "deadline", "createdAt"];

    if (!sortBy || !allowedFields.includes(sortBy)) {
        return { createdAt: -1 };
    }

    return { [sortBy]: order === "asc" ? 1 : -1 };
};

const buildPagination = (page, limit) => {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 5;
    const skip = (pageNumber - 1) * limitNumber;
    return { pageNumber, limitNumber, skip };
};

// GET TASKS
const getTasks = async (req, res) => {
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
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// CREATE
const createTask = async (req, res) => {
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
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// UPDATE
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ error: "Task not found" });

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        Object.assign(task, req.body);
        await task.save();

        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// DELETE
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ error: "Task not found" });

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        await task.deleteOne();
        res.json({ message: "Task deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// TOGGLE COMPLETE
const toggleComplete = async (req, res) => {
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
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete
};
