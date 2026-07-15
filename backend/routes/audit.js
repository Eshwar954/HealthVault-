const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { getMyAuditLogs } = require("../Controllers/auditController");

const router = express.Router();

router.get("/me", requireAuth, requireRole("user"), getMyAuditLogs);

module.exports = router;
