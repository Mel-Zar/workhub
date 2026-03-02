import Task from "../models/Task.js";
import fs from "fs/promises";
import path from "path";
import asyncHandler from "express-async-handler";
import { validateUploadedFile } from "../middleware/uploadMiddleware.js";

/* ================= HELPERS ================= */
const buildQuery = (userId, search, priority, completed, category) => {
    const query = { user: userId };

    if (search) query.$text = { $search: search };
    if (priority) query.priority = priority;
    if (category) query.category = category;

    if (completed !== undefined) {
        query.completed = completed === "true" || completed === true;
    }

    return query;
};

/* ================= TASKS ================= */
export const getTasks = asyncHandler(async (req, res) => {

    const { search, priority, category, completed, sortBy } = req.query;

    const page = Number(req.query.page) || 1;
    const DEFAULT_LIMIT = 9;
    const MAX_LIMIT = 50;

    const limit = Math.min(
        Number(req.query.limit) || DEFAULT_LIMIT,
        MAX_LIMIT
    );

    const query = buildQuery(
        req.user.id,
        search,
        priority,
        completed,
        category
    );

    const skip = (page - 1) * limit;

    let sortOption = { createdAt: -1 };
    const allowedSortFields = ["createdAt", "deadline", "priority", "title"];

    if (sortBy && allowedSortFields.includes(sortBy)) {
        sortOption = { [sortBy]: 1 };
    }

    const total = await Task.countDocuments(query);

    const tasks = await Task.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean();

    res.json({ tasks, page, pages: Math.ceil(total / limit), total });
});


export const getTask = asyncHandler(async (req, res) => {

    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!task)
        return res.status(404).json({ error: "Task not found" });

    res.json(task);
});


export const createTask = asyncHandler(async (req, res) => {

    if (!req.body.title)
        return res.status(400).json({ error: "Title is required" });

    const images =
        req.files?.map(f => `/uploads/${f.filename}`) || [];

    if (req.files) {
        for (const file of req.files) {
            await validateUploadedFile(
                path.join(process.cwd(), "uploads", file.filename)
            );
        }
    }

    const task = await Task.create({
        title: req.body.title,
        category: req.body.category || "general",
        priority: req.body.priority || "medium",
        deadline: req.body.deadline || null,
        images,
        user: req.user.id
    });

    res.status(201).json(task);
});


export const updateTask = asyncHandler(async (req, res) => {

    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!task)
        return res.status(404).json({ error: "Task not found" });

    const allowedFields = [
        "title",
        "description",
        "category",
        "priority",
        "deadline",
        "completed"
    ];

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            task[field] = req.body[field];
        }
    });

    await task.save();
    res.json(task);
});


/* ================= IMAGES ================= */

export const addImages = asyncHandler(async (req, res) => {
    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!task)
        return res.status(404).json({ error: "Task not found" });

    // Validera alla uppladdade filer
    for (const file of req.files) {
        await validateUploadedFile(
            path.join(process.cwd(), "uploads", file.filename)
        );
    }

    // Lägg till de nya bilderna i task.images
    const images = req.files.map(f => `/uploads/${f.filename}`);
    task.images.push(...images);

    await task.save();

    res.json(task);
});



export const removeImage = asyncHandler(async (req, res) => {

    const imagePath = req.query.image;

    if (!imagePath)
        return res.status(400).json({
            error: "Image query param missing"
        });

    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!task)
        return res.status(404).json({
            error: "Task not found"
        });

    const filename = path.basename(imagePath);

    const exists = task.images.some(
        img => path.basename(img) === filename
    );

    if (!exists)
        return res.status(404).json({
            error: "Image not found on task"
        });

    task.images = task.images.filter(
        img => path.basename(img) !== filename
    );

    await task.save();

    const filePath = path.join(
        process.cwd(),
        "uploads",
        filename
    );

    try {
        await fs.unlink(filePath);
    } catch (err) {
        if (process.env.NODE_ENV === "development") {
            console.error(err);
        }
    }

    res.json(task);
});


/* ================= DELETE TASK ================= */

export const deleteTask = asyncHandler(async (req, res) => {

    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!task)
        return res.status(404).json({
            error: "Task not found"
        });

    if (task.images?.length > 0) {

        for (const imagePath of task.images) {
            try {
                const fullPath = path.join(
                    process.cwd(),
                    imagePath.replace(/^\/+/, "")
                );

                await fs.unlink(fullPath);
            } catch (err) {
                console.warn(
                    "Could not delete file:",
                    imagePath
                );
            }
        }
    }

    await task.deleteOne();

    res.json({ message: "Task deleted" });
});


/* ================= REORDER IMAGES ================= */

export const reorderImages = asyncHandler(async (req, res) => {

    const { images } = req.body;

    if (!Array.isArray(images))
        return res.status(400).json({
            error: "Images array required"
        });

    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!task)
        return res.status(404).json({
            error: "Task not found"
        });

    const existingImages = task.images.map(
        img => img.toString()
    );

    const isValid = images.every(img =>
        existingImages.includes(img)
    );

    if (!isValid)
        return res.status(400).json({
            error: "Invalid image order data"
        });

    task.images = images;
    await task.save();

    res.json(task);
});


export const toggleComplete = asyncHandler(async (req, res) => {

    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    if (!task)
        return res.status(404).json({
            error: "Task not found"
        });

    task.completed = !task.completed;
    await task.save();

    res.json(task);
});
