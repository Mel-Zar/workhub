import express from "express";
import auth from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

import {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete
} from "../controllers/taskController.js";

const router = express.Router();

// GET all tasks
router.get("/", auth, getTasks);

// GET single task
router.get("/:id", auth, getTask);

// CREATE task + upload images
router.post(
    "/",
    auth,
    upload.array("images", 5),   // max 5 images
    createTask
);

// UPDATE task
router.put("/:id", auth, updateTask);

// DELETE task
router.delete("/:id", auth, deleteTask);

// TOGGLE completed
router.patch("/:id/toggle", auth, toggleComplete);

export default router;