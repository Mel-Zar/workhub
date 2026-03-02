import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

/* ================= ENV ================= */
dotenv.config();

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets missing in .env");
}

const app = express();
const PORT = process.env.PORT || 5001;

/* ================= FIX __dirname ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= SECURITY MIDDLEWARE ================= */

/* 🔥 FIX: Allow cross-origin resources (images etc) */
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })
);

/* ================= CORS ================= */
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

/* ================= BODY PARSERS ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */

/* 🔥 EXTRA SAFE: Apply CORS directly to uploads */
app.use(
    "/uploads",
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    }),
    express.static(path.join(__dirname, "uploads"))
);

/* ================= RATE LIMITER ================= */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many login attempts. Try again later."
});

/* ================= ROUTES ================= */

app.use("/api/auth", (req, res, next) => {
    if (req.path === "/login" && req.method === "POST") {
        return loginLimiter(req, res, next);
    }
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
    res.send("Workhub API running");
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use(errorHandler);

/* ================= GRACEFUL ERROR HANDLING ================= */
process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION:", err);
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:", err);
    process.exit(1);
});

/* ================= START SERVER ROBUST ================= */
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();
