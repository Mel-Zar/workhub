import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER =================
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ error: "All fields are required" });

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email))
            return res.status(400).json({ error: "Invalid email format" });

        if (password.length < 6)
            return res.status(400).json({ error: "Password must be at least 6 characters" });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Email and password required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET || "refreshsecret",
            { expiresIn: "7d" }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.json({ accessToken, refreshToken });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// ================= REFRESH =================
export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

    try {
        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || "refreshsecret"
        );

        const user = await User.findById(payload.id);
        if (!user || user.refreshToken !== refreshToken)
            return res.status(403).json({ error: "Invalid refresh token" });

        const newAccessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });

    } catch (err) {
        console.error(err);
        res.status(403).json({ error: "Invalid refresh token" });
    }
};

// ================= LOGOUT =================
export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ error: "Refresh token required" });

        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.json({ message: "Logged out" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
