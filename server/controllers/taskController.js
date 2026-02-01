import Task from "../models/Task.js";

/* ================= HELPERS ================= */

const buildQuery = (userId, search, priority, completed, category, dateRange) => {
    const query = { user: userId };

    // 🔍 SEARCH
    if (search && search.trim() !== "") {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ];
    }

    // 🎯 PRIORITY
    if (priority) query.priority = priority;

    // 📂 CATEGORY
    if (category) query.category = category;

    // ✅ COMPLETED
    if (completed === "true") query.completed = true;
    if (completed === "false") query.completed = false;

    // 📅 DATE RANGE
    if (dateRange) {
        const [from, to] = dateRange.split(",");

        query.deadline = {};
        if (from) query.deadline.$gte = new Date(from);
        if (to) query.deadline.$lte = new Date(to);
    }

    return query;
};

const buildSortOptions = (sortBy, order) => {
    const allowedFields = ["title", "priority", "deadline", "createdAt"];
    if (!allowedFields.includes(sortBy)) return { createdAt: -1 };

    return { [sortBy]: order === "asc" ? 1 : -1 };
};

/* ================= GET TASKS + PAGINATION ================= */

const getTasks = async (req, res) => {
    try {
        const {
            search,
            priority,
            category,
            completed,
            sortBy,
            order,
            dateRange,
            page = 1,
            limit = 5
        } = req.query;

        const query = buildQuery(
            req.user.id,
            search,
            priority,
            completed,
            category,
            dateRange
        );

        const sortOptions = buildSortOptions(sortBy, order);

        const skip = (Number(page) - 1) * Number(limit);

        const total = await Task.countDocuments(query);

        const tasks = await Task.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        res.json({
            tasks,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total
        });

    } catch (err) {
        console.error("GET TASKS ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= GET SINGLE TASK ================= */

const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) return res.status(404).json({ error: "Task not found" });

        res.json({ task });
    } catch (err) {
        console.error("GET SINGLE TASK ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= GET CATEGORIES ================= */

const getCategories = async (req, res) => {
    try {
        const categories = await Task.distinct("category", {
            user: req.user.id,
            category: { $ne: "" }
        });

        res.json(categories);
    } catch (err) {
        console.error("GET CATEGORIES ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= CREATE TASK ================= */

const createTask = async (req, res) => {
    try {
        if (!req.body.title)
            return res.status(400).json({ error: "Title is required" });

        const task = await Task.create({
            ...req.body,
            user: req.user.id
        });

        res.status(201).json(task);
    } catch (err) {
        console.error("CREATE TASK ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= UPDATE TASK ================= */

const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );

        if (!task) return res.status(404).json({ error: "Task not found" });

        res.json(task);
    } catch (err) {
        console.error("UPDATE TASK ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= DELETE TASK ================= */

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) return res.status(404).json({ error: "Task not found" });

        res.json({ message: "Task deleted" });
    } catch (err) {
        console.error("DELETE TASK ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= TOGGLE COMPLETE ================= */

const toggleComplete = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) return res.status(404).json({ error: "Task not found" });

        task.completed = !task.completed;
        await task.save();

        res.json(task);
    } catch (err) {
        console.error("TOGGLE TASK ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= EXPORT ================= */

export {
    getTasks,
    getTask,
    getCategories,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete
};
