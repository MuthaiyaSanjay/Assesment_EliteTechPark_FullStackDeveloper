const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected routes
router.get("/verify-token", authMiddleware, authController.verifyToken);
router.post("/change-password", authMiddleware, authController.changePassword);

// Staff creation route - Only accessible by Admin
router.post("/create-staff", authMiddleware, roleMiddleware(["admin"]), authController.createStaff);


module.exports = router;
