const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const sendOtpToUser = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    html: `<h3>Your OTP is: <strong>${otp}</strong></h3><p>This OTP will expire in 30 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtpToUser;
