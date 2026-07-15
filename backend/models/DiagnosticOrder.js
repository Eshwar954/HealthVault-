const mongoose = require("mongoose");

const diagnosticOrderSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    diagnosticCenterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    tests: [{ type: String, trim: true }],
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["ordered", "accepted", "uploaded", "completed", "cancelled"],
      default: "ordered",
    },
    accessGrantId: { type: mongoose.Schema.Types.ObjectId, ref: "AccessGrant" },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.DiagnosticOrder ||
  mongoose.model("DiagnosticOrder", diagnosticOrderSchema);
