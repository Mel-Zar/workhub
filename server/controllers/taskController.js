import Task from "../models/Task.js";
import fs from "fs";
import path from "path";

/* ================= HELPERS ================= */
const buildQuery = (userId, search, priority, completed, category) => {
    const query = { user: userId };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ];
    }

    if (priority) query.priority = priority;
    if (category) query.category = category;

    if (completed === "true") query.completed = true;
    if (completed === "false") query.completed = false;

    return query;
};

/* ================= TASKS ================= */
export const getTasks = async (req, res) => {
    try {
        const { search, priority, category, completed, page = 1, limit = 5 } = req.query;

        const query = buildQuery(req.user.id, search, priority, completed, category);
        const skip = (page - 1) * limit;

        const total = await Task.countDocuments(query);
        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.json({ tasks, page: Number(page), pages: Math.ceil(total / limit), total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(task);
    } catch (err) {
        console.error("GET TASK ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const createTask = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const images = req.files?.map(f => `/uploads/${f.filename}`) || [];

        const task = await Task.create({
            title: req.body.title,
            category: req.body.category || "general",
            priority: req.body.priority || "medium",
            deadline: req.body.deadline || null,
            images,
            user: req.user.id
        });

        res.status(201).json(task);
    } catch (err) {
        console.error("CREATE ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        Object.assign(task, req.body);
        await task.save();

        res.json(task);
    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= IMAGES ================= */
export const addImages = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        const images = req.files.map(f => `/uploads/${f.filename}`);
        task.images.push(...images);

        await task.save();
        res.json(task);
    } catch (err) {
        console.error("ADD IMAGE ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const removeImage = async (req, res) => {
    try {
        const imagePath = req.query.image;
        if (!imagePath) {
            return res.status(400).json({ error: "Image query param missing" });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        const filename = path.basename(imagePath);

        const exists = task.images.some(
            img => path.basename(img) === filename
        );

        if (!exists) {
            return res.status(404).json({ error: "Image not found on task" });
        }

        task.images = task.images.filter(
            img => path.basename(img) !== filename
        );

        await task.save();

        const filePath = path.join(process.cwd(), "uploads", filename);
        fs.unlink(filePath, () => { });

        res.json(task);
    } catch (err) {
        console.error("REMOVE IMAGE ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= OTHER ================= */
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

export const toggleComplete = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        task.completed = !task.completed;
        await task.save();

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
