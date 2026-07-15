const express = require("express");
const { registerUser, loginUser, logoutUser, getCurrentUser } = require("../Controllers/authcontroller");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", requireAuth, getCurrentUser);

module.exports = router;
