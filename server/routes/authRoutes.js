import express from "express";
import {
    registerUser,
    loginUser,
    updateUser,
    deleteAccount,
    refreshAccessToken,
    logout
} from "../controllers/authController.js";

import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", auth, updateUser);
router.delete("/delete", auth, deleteAccount);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

export default router;
