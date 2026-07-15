const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");
const diagnosticRoutes = require("./routes/diagnostics");
const doctorRoutes = require("./routes/doctor");

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  process.env.CLIENT_URL,
  "https://healthvault-1-nim9.onrender.com",
  "https://healthvault-i2xn.onrender.com",
].filter(Boolean);
// Middleware
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
); // Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", userRoutes);
app.use("/api/files", require("./routes/file")); // New route for file upload
app.use("/api/diagnostic", diagnosticRoutes); // New route for diagnostic data
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/diagnostic-orders", require("./routes/diagnosticOrders"));
app.use("/api/audit", require("./routes/audit"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
