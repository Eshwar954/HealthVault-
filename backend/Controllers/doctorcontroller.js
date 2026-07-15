const User = require("../models/User");
const mongoose = require("mongoose");

const doctorEditableFields = [
  "name",
  "specialization",
  "experience",
  "phone",
  "clinicAddress",
  "city",
  "state",
];

const pickAllowed = (source, allowedFields) =>
  allowedFields.reduce((result, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      result[field] = source[field];
    }
    return result;
  }, {});

const getDoctorMe = (req, res) => {
  res.json({ doctor: req.user });
};

const listDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .select("name email specialization clinicAddress experience city state")
      .sort({ name: 1 });
    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

const updateDoctor = async (req, res) => {
  try {
    if (req.user) {
      const updatedData = pickAllowed(req.body, doctorEditableFields);
      const updatedDoctor = await User.findOneAndUpdate(
        { _id: req.user._id, role: "doctor" },
        { $set: updatedData },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedDoctor) {
        return res.status(404).json({ message: "Doctor not found or update failed" });
      }

      return res.status(200).json({ message: "Doctor updated successfully", doctor: updatedDoctor });
    }

    const { email, doctorId, ...updatedData } = req.body;

    if (!email && !doctorId) {
      return res.status(400).json({ message: "Provide email or doctorId" });
    }

    let query = {};
    if (email) query.email = email;
    if (doctorId) {
      if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        return res.status(400).json({ message: "Invalid doctor ID format" });
      }
      query._id = doctorId;
    }

    query.role = "doctor";

    const updatedDoctor = await User.findOneAndUpdate(
      query,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found or update failed" });
    }

    // Only return selected fields
    const {
      name,
      email: doctorEmail,
      specialization,
      experience,
      phone: doctorPhone,
      clinicAddress,
      city,
      state
    } = updatedDoctor;

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor: {
        name,
        email: doctorEmail,
        specialization,
        experience,
        phone: doctorPhone,
        clinicAddress,
        city,
        state
      }
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { updateDoctor, getDoctorMe, listDoctors };
