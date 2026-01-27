const express = require("express");
const connectDB = require("./config/connectDB");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes); // Korrekt route utan mellanslag

// Test route
app.get("/", (req, res) => {
    res.send("WorkHub API running");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});