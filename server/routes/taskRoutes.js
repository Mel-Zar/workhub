import express from "express";
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    toggleComplete,
    getCategories
} from "../controllers/taskController.js";

import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// ORDER ÄR VIKTIG
router.get("/", auth, getTasks);
router.get("/categories", auth, getCategories);
router.post("/", auth, createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.patch("/:id/toggle", auth, toggleComplete);

export default router;
