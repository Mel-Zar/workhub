const express = require("express");
const { createTask, getTasks, updateTask, deleteTask, toggleComplete } = require("../controllers/taskController");

const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.patch("/:id/complete", auth, toggleComplete);


module.exports = router;
