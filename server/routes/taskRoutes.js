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

// ================= TASK ROUTES =================

// GET all tasks (filter, search, pagination, sort)
router.get("/", auth, getTasks);

// GET single task
router.get("/:id", auth, getTask);

// CREATE task
router.post("/", auth, upload.array("images", 5), createTask);

// UPDATE task
router.put("/:id", auth, updateTask);

// DELETE task
router.delete("/:id", auth, deleteTask);

// ADD images
router.post("/:id/images", auth, upload.array("images", 5), addImages);

// REMOVE image
router.delete("/:id/images", auth, removeImage);

export default router;
