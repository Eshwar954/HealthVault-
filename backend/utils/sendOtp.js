require("dotenv").config();
const axios = require("axios");

const sendOtpToUser = async (email, otp) => {
  console.log("[MAIL] Sending OTP via Brevo");

  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: process.env.EMAIL_FROM, name: "HealthVault" },
        to: [{ email }],
        subject: "Your OTP Code",
        htmlContent: `
          <h3>Your OTP is: <strong>${otp}</strong></h3>
          <p>This OTP will expire in 30 minutes.</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[MAIL] OTP email sent (Brevo)");

  } catch (err) {
    console.error("[MAIL] Brevo failed");
    console.error(err.response?.data || err.message);
    throw err;
  }
};

module.exports = sendOtpToUser;
