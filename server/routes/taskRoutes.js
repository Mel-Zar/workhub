import express from "express";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    addImages,
    removeImage,
    reorderImages
} from "../controllers/taskController.js";


const router = express.Router();

// TASK ROUTES
router.get("/", auth, getTasks);
router.get("/:id", auth, getTask);
router.post("/", auth, upload.array("images", 5), createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.patch("/:id/toggle", auth, toggleComplete);

// IMAGE ROUTES
router.post("/:id/images", auth, upload.array("images", 5), addImages);
router.delete("/:id/images", auth, removeImage);
router.put("/:id/reorder-images", auth, reorderImages);


export default router;