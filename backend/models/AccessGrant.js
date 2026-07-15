const mongoose = require("mongoose");

const accessGrantSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    granteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    granteeRole: {
      type: String,
      enum: ["doctor", "diagnostic center"],
      required: true,
    },
    sourceType: {
      type: String,
      enum: ["appointment", "diagnostic_order"],
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    scope: [
      {
        type: String,
        enum: ["view_records", "upload_records", "view_selected_records"],
      },
    ],
    recordIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "revoked", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.AccessGrant || mongoose.model("AccessGrant", accessGrantSchema);
