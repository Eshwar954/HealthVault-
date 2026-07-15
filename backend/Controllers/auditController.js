const AuditLog = require("../models/AuditLog");

const getMyAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({ patientId: req.user._id })
      .populate("actorId", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch access history" });
  }
};

module.exports = { getMyAuditLogs };
