const OtpSession = require("../models/OtpSession");

const verifyOtpSession = async (req, res, next) => {
  const { loginId } = req.body;

  if (!loginId) return res.status(400).json({ message: "Login ID is required" });

  const session = await OtpSession.findOne({ loginId });

  if (!session || !session.isVerified || session.expiresAt < new Date()) {
    return res.status(403).json({ message: "OTP session invalid or expired" });
  }

  next();
};

module.exports = verifyOtpSession;
