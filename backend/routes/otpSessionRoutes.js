const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../Controllers/otpSessionController");

router.post("/request", sendOtp);   // /api/otp/request
router.post("/verify", verifyOtp);  // /api/otp/verify

module.exports = router;
