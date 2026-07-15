const express = require("express");
const upload = require("../config/multerConfig");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  listDiagnosticCenters,
  createDiagnosticOrder,
  getAssignedOrders,
} = require("../Controllers/diagnosticOrderController");
const { uploadDiagnosticOrderReport } = require("../Controllers/filecontroller");

const router = express.Router();

router.get("/centers", requireAuth, listDiagnosticCenters);
router.post("/", requireAuth, requireRole("user", "doctor"), createDiagnosticOrder);
router.get("/assigned", requireAuth, requireRole("diagnostic center"), getAssignedOrders);
router.post(
  "/:id/upload-report",
  requireAuth,
  requireRole("diagnostic center"),
  upload.single("file"),
  uploadDiagnosticOrderReport
);

module.exports = router;
