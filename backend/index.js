const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const updateRoutes = require('./routes/update'); // ✅ Import the router
const diagnosticRoutes = require("./routes/diagnostics");
const otpRoutes = require("./routes/otpSessionRoutes");
const doctorRoutes = require('./routes/doctor');




dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow credentials (cookies)
  }));
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', userRoutes);
app.use('/api/user', updateRoutes); // ✅ Register router here
app.use('/api/files', require('./routes/file')); // New route for file upload
app.use('/api/diagnostic', diagnosticRoutes); // New route for diagnostic data
app.use('/api/otp', otpRoutes); // New route for OTP session
app.use('/api/doctors', doctorRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
