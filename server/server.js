// server/server.js
const express = require("express");
const connectDB = require("./config/connectDB");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("WorkHub API running");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
