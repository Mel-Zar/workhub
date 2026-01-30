import Task from "../models/Task.js";

/* ================= HELPERS ================= */

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

    // 🔍 SEARCH
    if (search && search.trim() !== "") {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ];
    }

    // 🎯 PRIORITY
    if (priority && priority !== "all") {
        query.priority = priority;
    }

    // 📂 CATEGORY
    if (category && category !== "all") {
        query.category = category;
    }

    // ✅ COMPLETED
    if (completed === "true") query.completed = true;
    if (completed === "false") query.completed = false;

    // 📅 DATE
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

/* ================= GET TASKS ================= */

const getTasks = async (req, res) => {
    try {

        const {
            search,
            priority,
            category,
            completed,
            sortBy,
            order,
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

        const tasks = await Task.find(query).sort(sortOptions);

        res.json({ tasks });

    } catch (err) {
        console.error("GET TASKS ERROR:", err);
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

/* ================= CREATE ================= */

const createTask = async (req, res) => {
    try {

        const { title, description, priority, deadline, category } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            deadline,
            category,
            user: req.user.id
        });

        res.status(201).json(task);

    } catch (err) {
        console.error("CREATE TASK ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= UPDATE ================= */

const updateTask = async (req, res) => {
    try {

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) return res.status(404).json({ error: "Task not found" });

        Object.assign(task, req.body);
        await task.save();

        res.json(task);

    } catch (err) {
        console.error("UPDATE TASK ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= DELETE ================= */

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

/* ================= TOGGLE ================= */

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

export {
    getTasks,
    getCategories,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete
};
