import Task from "../models/Task.js";
import fs from "fs";
import path from "path";

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

    // SEARCH
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ];
    }

    // PRIORITY 
    if (priority) {
        query.priority = new RegExp(`^${priority}$`, "i");
    }

    // PRIORITY (case-insensitive)
    if (priority) {
        query.priority = new RegExp(`^${priority}$`, "i");
    }

    // COMPLETED
    if (completed === "true") query.completed = true;
    if (completed === "false") query.completed = false;

    // ✅ DATE RANGE (deadline)
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

/* ================= GET TASKS ================= */

const getTasks = async (req, res) => {
    try {
        const {
            search,
            priority,
            category,
            completed,
            fromDate,
            toDate,
            page = 1,
            limit = 5
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

/* ================= GET SINGLE ================= */

const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) return res.status(404).json({ error: "Task not found" });

        res.json(task);
    } catch {
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= CREATE ================= */

const createTask = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const imagePaths = req.files
            ? req.files.map(file => `/uploads/${file.filename}`)
            : [];

        const task = await Task.create({
            title: req.body.title,
            priority: (req.body.priority || "medium").toLowerCase(),
            category: req.body.category || "",
            deadline: req.body.deadline || null,
            images: imagePaths,
            user: req.user.id
        });

        res.status(201).json(task);
    } catch (err) {
        console.error("CREATE ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= UPDATE ================= */

const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            {
                title: req.body.title,
                priority: req.body.priority?.toLowerCase(),
                category: req.body.category,
                deadline: req.body.deadline
            },
            { new: true }
        );

        if (!task) return res.status(404).json({ error: "Task not found" });

        res.json(task);
    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= ADD IMAGES ================= */

const addImages = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) return res.status(404).json({ error: "Task not found" });

        const newImages = req.files.map(
            file => `/uploads/${file.filename}`
        );

        task.images.push(...newImages);
        await task.save();

        res.json(task);
    } catch (err) {
        console.error("ADD IMAGE ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= REMOVE IMAGE ================= */

const removeImage = async (req, res) => {
    try {
        const { image } = req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) return res.status(404).json({ error: "Task not found" });

        task.images = task.images.filter(img => img !== image);
        await task.save();

        const filePath = path.join(
            process.cwd(),
            image.replace("/uploads", "uploads")
        );

        fs.unlink(filePath, () => { });

        res.json(task);
    } catch (err) {
        console.log("REMOVE IMAGE ERROR:", err);
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
    } catch {
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

        if (!task) return res.status(404).json({ message: "Task not found" });

        task.completed = !task.completed;
        task.priority = task.priority.toLowerCase();

        await task.save();

        res.json(task);
    } catch (err) {
        console.error("TOGGLE ERROR:", err);
        res.status(500).json({ message: "Toggle failed" });
    }
};

/* ================= EXPORTS ================= */

export {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    addImages,
    removeImage
};
