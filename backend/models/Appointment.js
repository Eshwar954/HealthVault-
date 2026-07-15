const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 30 },
    reason: { type: String, trim: true },
    status: {
      type: String,
      enum: ["requested", "accepted", "rejected", "cancelled", "completed"],
      default: "requested",
    },
    accessGrantId: { type: mongoose.Schema.Types.ObjectId, ref: "AccessGrant" },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
