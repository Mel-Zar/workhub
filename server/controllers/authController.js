import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";


// ================= HELPERS =================
const createAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
};

const createRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};


// ================= REGISTER =================
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!name || !email || !password)
        return res.status(400).json({ error: "All fields are required" });

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(normalizedEmail))
        return res.status(400).json({ error: "Invalid email format" });

    if (password.length < 6)
        return res.status(400).json({ error: "Password must be at least 6 characters" });

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser)
        return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email: normalizedEmail,
        password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
});


// ================= LOGIN =================
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Email and password required" });

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user)
        return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});


// ================= UPDATE PROFILE =================
const updateUser = asyncHandler(async (req, res) => {

    if (!req.user?.id)
        return res.status(401).json({ error: "Not authenticated" });

    const userId = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body;

    if (!currentPassword)
        return res.status(400).json({ error: "Current password required to update profile" });

    const user = await User.findById(userId);
    if (!user)
        return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
        return res.status(401).json({ error: "Wrong password" });

    if (name) user.name = name;

    if (email) {
        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser && existingUser._id.toString() !== userId)
            return res.status(400).json({ error: "Email already in use" });

        user.email = normalizedEmail;
    }

    if (newPassword) {
        if (newPassword.length < 6)
            return res.status(400).json({ error: "Password must be at least 6 characters" });

        user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    const newAccessToken = createAccessToken(user);

    res.json({
        message: "Profile updated",
        accessToken: newAccessToken,
        user: {
            name: user.name,
            email: user.email
        }
    });
});


// ================= DELETE ACCOUNT =================
const deleteAccount = asyncHandler(async (req, res) => {

    if (!req.user?.id)
        return res.status(401).json({ error: "Not authenticated" });

    const { currentPassword } = req.body;

    if (!currentPassword)
        return res.status(400).json({ error: "Password required" });

    const user = await User.findById(req.user.id);
    if (!user)
        return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
        return res.status(401).json({ error: "Wrong password" });

    await User.findByIdAndDelete(req.user.id);

    res.json({ message: "Account deleted" });
});


// ================= REFRESH =================
const refreshAccessToken = asyncHandler(async (req, res) => {

    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.status(401).json({ error: "Refresh token required" });

    const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(payload.id);

    if (!user || user.refreshToken !== refreshToken)
        return res.status(403).json({ error: "Invalid refresh token" });

    const newRefreshToken = createRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    const newAccessToken = createAccessToken(user);

    res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    });
});


// ================= LOGOUT =================
const logout = asyncHandler(async (req, res) => {

    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.status(400).json({ error: "Refresh token required" });

    try {
        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(payload.id);

        if (user) {
            user.refreshToken = null;
            await user.save();
        }

    } catch (err) {
        const decoded = jwt.decode(refreshToken);

        if (decoded?.id) {
            const user = await User.findById(decoded.id);
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }
    }

    res.json({ message: "Logged out" });
});


export {
    registerUser,
    loginUser,
    updateUser,
    deleteAccount,
    refreshAccessToken,
    logout
};
