const OtpSession = require("../models/OtpSession");
const User = require("../models/User"); // assuming this exists
const sendOtpToUser = require("../utils/sendOtp");

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
  const { loginId } = req.body;

  if (!loginId) return res.status(400).json({ message: "Login ID is required" });

  try {
    const user = await User.findOne({ loginId });
    if (!user || !user.email) {
      return res.status(404).json({ message: "User or email not found" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await OtpSession.findOneAndUpdate(
      { loginId },
      { otp, expiresAt, isVerified: false },
      { upsert: true, new: true }
    );

    await sendOtpToUser(user.email, otp);
    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ message: "Server error while sending OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { loginId, otp } = req.body;

  if (!loginId || !otp) return res.status(400).json({ message: "Login ID and OTP are required" });

  try {
    const session = await OtpSession.findOne({ loginId });

    if (!session) return res.status(404).json({ message: "No OTP session found" });
    if (session.expiresAt < new Date()) return res.status(410).json({ message: "OTP expired" });
    if (session.otp !== otp) return res.status(401).json({ message: "Incorrect OTP" });

    session.isVerified = true;
    await session.save();

    res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server error while verifying OTP" });
  }
};
