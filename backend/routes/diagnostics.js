const express = require("express");
const router = express.Router();
const {
  getDiagnostic,
  getDiagnosticMe,
  updateDiagnostic
} = require("../Controllers/diagnosticController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/me", requireAuth, requireRole("diagnostic center"), getDiagnosticMe);
router.put("/me", requireAuth, requireRole("diagnostic center"), updateDiagnostic);
router.get("/", requireAuth, getDiagnostic); // GET /api/diagnostic?email=...
router.put("/update", requireAuth, requireRole("diagnostic center"), updateDiagnostic); // PUT /api/diagnostic/update

module.exports = router;
