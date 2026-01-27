const express = require("express");
const { registerUser, loginUser, refreshToken } = require("../controllers/authController");

const router = express.Router();

// REGISTER ny användare
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

// REFRESH TOKEN
router.post("/refresh", refreshToken);

module.exports = router;
