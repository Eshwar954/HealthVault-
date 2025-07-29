const mongoose = require('mongoose');

const otpSessionSchema = new mongoose.Schema({
  loginId: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('OtpSession', otpSessionSchema);
