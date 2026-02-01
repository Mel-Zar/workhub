import Task from "../models/Task.js";

/* ===== HELPERS ===== */

const buildQuery = (userId, search, priority, completed, category) => {
    const query = { user: userId };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ];
    }

    if (priority) query.priority = priority;
    if (category) query.category = category;

    if (completed === "true") query.completed = true;
    if (completed === "false") query.completed = false;

    return query;
};

/* ===== GET TASKS + PAGINATION ===== */

export const getTasks = async (req, res) => {
    try {
        const {
            search,
            priority,
            category,
            completed,
            page = 1,
            limit = 5
        } = req.query;

        const query = buildQuery(
            req.user.id,
            search,
            priority,
            completed,
            category
        );

        const skip = (page - 1) * limit;

        const total = await Task.countDocuments(query);

        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.json({
            tasks,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ===== GET SINGLE ===== */

export const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task)
            return res.status(404).json({ error: "Task not found" });

        res.json(task);

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

/* ===== CREATE ===== */

export const createTask = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const imagePaths = req.files
            ? req.files.map(file => `/uploads/${file.filename}`)
            : [];

        const task = await Task.create({
            title: req.body.title,
            priority: req.body.priority,
            category: req.body.category,
            deadline: req.body.deadline,
            images: imagePaths,
            user: req.user.id
        });

        res.status(201).json(task);

    } catch (err) {
        console.error("CREATE TASK ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};


/* ===== UPDATE ===== */

export const updateTask = async (req, res) => {
    try {

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );

        if (!task)
            return res.status(404).json({ error: "Task not found" });

        res.json(task);

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

/* ===== DELETE ===== */

export const deleteTask = async (req, res) => {
    try {

        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task)
            return res.status(404).json({ error: "Task not found" });

        res.json({ message: "Task deleted" });

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

/* ===== TOGGLE COMPLETE ===== */

export const toggleComplete = async (req, res) => {
    try {

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task)
            return res.status(404).json({ error: "Task not found" });

        task.completed = !task.completed;
        await task.save();

        res.json(task);

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
