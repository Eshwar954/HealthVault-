const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Helper function to generate simple loginId
const generateLoginId = async (role) => {
  const prefix = {
    user: "USR",
    doctor: "DOC",
    "diagnostic center": "DIA",
  }[role.toLowerCase()] || "GEN";

  let loginId;
  let isUnique = false;

  while (!isUnique) {
    const randomNumber = Math.floor(100 + Math.random() * 900);
    loginId = `${prefix}${randomNumber}`;
    const existingUser = await User.findOne({ loginId });
    if (!existingUser) isUnique = true;
  }

  return loginId;
};

// Register User
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      age,
      gender,
      phone,
      specialization,
      experience,
      clinicAddress,
      services,
      address,
      dateOfBirth,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Validate gender if role is 'user'
    if (role.toLowerCase() === "user" && !["Male", "Female", "Other"].includes(gender)) {
      return res.status(400).json({ message: "Invalid gender value. Allowed: Male, Female, Other." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate loginId
    const loginId = await generateLoginId(role);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object based on role
    const newUser = new User({
      loginId,
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === "user" && { age, gender, phone, dateOfBirth }),
      ...(role === "doctor" && { specialization, experience, clinicAddress }),
      ...(role === "diagnostic center" && {
        services: Array.isArray(services)
          ? services.map((s) => s.trim())
          : typeof services === "string"
          ? services.split(",").map((s) => s.trim())
          : [],
        address,
      }),
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      loginId,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({ message: "Incorrect role" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      email: user.email,
      role: user.role,
      loginId: user.loginId,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout User
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successful" });
};

module.exports = { registerUser, loginUser, logoutUser };
