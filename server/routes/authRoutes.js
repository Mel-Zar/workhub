const express = require("express");
const { registerUser, loginUser, refreshToken, logout } = require("../controllers/authController");

const router = express.Router();

// REGISTER ny användare
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

// REFRESH TOKEN
router.post("/refresh", refreshToken);

router.post("/logout", logout);


module.exports = router;
