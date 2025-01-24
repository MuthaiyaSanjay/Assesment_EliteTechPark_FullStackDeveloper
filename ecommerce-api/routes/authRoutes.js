const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected routes
router.get("/verify-token", authMiddleware, authController.verifyToken);
router.post("/change-password", authMiddleware, authController.changePassword);

module.exports = router;
