const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    actorRole: { type: String, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    resourceType: { type: String, required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    sourceType: { type: String },
    sourceId: { type: mongoose.Schema.Types.ObjectId },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
