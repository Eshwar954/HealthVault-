require("dotenv").config();
const nodemailer = require("nodemailer");

/**
 * Create SMTP transporter safely
 */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("SMTP credentials missing in environment variables");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,   // SMTP logs
    debug: true,    // protocol logs
  });

  return transporter;
};

/**
 * Verify SMTP at startup
 */
const verifySMTP = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("[SMTP] Transporter verified and ready");
  } catch (err) {
    console.error("[SMTP] VERIFY FAILED");
    console.error("[SMTP] Code:", err.code);
    console.error("[SMTP] Message:", err.message);
  }
};

// run once on load
verifySMTP();

/**
 * Send OTP email
 */
const sendOtpToUser = async (email, otp) => {
  console.log("[SMTP] Preparing OTP email");
  console.log("[SMTP] From:", process.env.EMAIL_USER);
  console.log("[SMTP] To:", email);

  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h3>Your OTP is: <strong>${otp}</strong></h3>
        <p>This OTP will expire in 30 minutes.</p>
      `,
    });

    console.log("[SMTP] Message ID:", info.messageId);
    console.log("[SMTP] Accepted:", info.accepted);
    console.log("[SMTP] Rejected:", info.rejected);

  } catch (err) {
    console.error("[SMTP] SEND FAILED");
    console.error("[SMTP] Code:", err.code);
    console.error("[SMTP] Message:", err.message);
    console.error("[SMTP] Full Error:", err);
    throw err;
  }
};

module.exports = sendOtpToUser;
