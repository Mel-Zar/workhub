import express from "express";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    addImages,
    removeImage
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", auth, getTasks);
router.get("/", auth, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 5,
            sortBy = "createdAt",
            search,
            priority,
            category,
            completed,
            fromDate,
            toDate
        } = req.query;

        // ================= BUILD FILTER =================
        const filter = { user: req.user.id };

        if (priority) filter.priority = priority;
        if (category) filter.category = category;

        if (completed !== undefined) {
            filter.completed = completed === "true";
        }

        if (fromDate || toDate) {
            filter.deadline = {};
            if (fromDate) filter.deadline.$gte = new Date(fromDate);
            if (toDate) filter.deadline.$lte = new Date(toDate);
        }

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        // ================= SORT =================
        const sort = {};
        sort[sortBy] = 1;

        // ================= QUERY =================
        const tasks = await Task.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Task.countDocuments(filter);

        res.json({
            tasks,
            pages: Math.ceil(total / limit)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/:id", auth, getTask);
router.post("/", auth, upload.array("images", 5), createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

router.post("/:id/images", auth, upload.array("images", 5), addImages);
router.delete("/:id/images", auth, removeImage);

export default router;
