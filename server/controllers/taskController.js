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

    // 🔍 SEARCH
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ];
    }

    // 🎯 PRIORITY
    if (priority) {
        query.priority = priority;
    }

    // 📁 CATEGORY
    if (category) {
        query.category = category;
    }

    // ✅ COMPLETED
    if (completed === "true") query.completed = true;
    if (completed === "false") query.completed = false;

    // 📅 DATE RANGE
    if (fromDate || toDate) {
        query.deadline = {};
        if (fromDate) query.deadline.$gte = new Date(fromDate);
        if (toDate) query.deadline.$lte = new Date(toDate);
    }

    return query;
};

/* ================= SORT HELPER ================= */

const buildSort = (sortBy) => {

    switch (sortBy) {

        case "deadline":
            return { deadline: 1 };

        case "priority":
            return { priority: 1 };

        case "title":
            return { title: 1 };

        case "createdAt":
        default:
            return { createdAt: -1 };
    }
};

/* ================= GET TASKS ================= */

export const getTasks = async (req, res) => {

    try {

        const {
            search,
            priority,
            completed,
            category,
            fromDate,
            toDate,
            sortBy,
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

        const sort = buildSort(sortBy);

        const skip = (page - 1) * limit;

        const total = await Task.countDocuments(query);

        const tasks = await Task.find(query)
            .sort(sort)          // ✅ FRONTEND STYR SORT
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

export const getTask = async (req, res) => {

    try {

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task)
            return res.status(404).json({ error: "Task not found" });

        res.json(task);

    } catch {
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= CREATE ================= */

export const createTask = async (req, res) => {

    try {

        const imagePaths = req.files
            ? req.files.map(file => `/uploads/${file.filename}`)
            : [];

        const task = await Task.create({

            title: req.body.title,
            priority: (req.body.priority || "medium").toLowerCase(),
            category: req.body.category || "",
            deadline: req.body.deadline || null,
            images: imagePaths,
            completed: false,
            user: req.user.id
        });

        res.status(201).json(task);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= UPDATE ================= */

export const updateTask = async (req, res) => {

    try {

        const updateData = {
            title: req.body.title,
            priority: req.body.priority?.toLowerCase(),
            category: req.body.category,
            deadline: req.body.deadline
        };

        // ✅ FIX CHECKBOX
        if (typeof req.body.completed === "boolean") {
            updateData.completed = req.body.completed;
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            updateData,
            { new: true }
        );

        if (!task)
            return res.status(404).json({ error: "Task not found" });

        res.json(task);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= DELETE ================= */

export const deleteTask = async (req, res) => {

    try {

        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task)
            return res.status(404).json({ error: "Task not found" });

        res.json({ message: "Task deleted" });

    } catch {
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= ADD IMAGES ================= */

export const addImages = async (req, res) => {

    try {

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        const newImages = req.files.map(
            file => `/uploads/${file.filename}`
        );

        task.images.push(...newImages);
        await task.save();

        res.json(task);

    } catch {
        res.status(500).json({ error: "Server error" });
    }
};

/* ================= REMOVE IMAGE ================= */

export const removeImage = async (req, res) => {

    try {

        const { image } = req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        task.images = task.images.filter(img => img !== image);
        await task.save();

        const filePath = path.join(
            process.cwd(),
            image.replace("/uploads", "uploads")
        );

        fs.unlink(filePath, () => { });

        res.json(task);

    } catch {
        res.status(500).json({ error: "Server error" });
    }
};
