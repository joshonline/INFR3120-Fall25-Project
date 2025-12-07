const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { requireAuth, requireGuest } = require("../middleware/auth");

// Public routes (no authentication required)
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes (authentication required)
router.post("/logout", requireAuth, userController.logout);
router.get("/profile", requireAuth, userController.getProfile);
router.put("/profile", requireAuth, userController.updateProfile);
router.put('/password', requireAuth, userController.changePassword);

module.exports = router;