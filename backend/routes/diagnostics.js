const express = require("express");
const router = express.Router();
const {
  getDiagnostic,
  updateDiagnostic
} = require("../Controllers/diagnosticController");

router.get("/", getDiagnostic); // GET /api/diagnostic?email=...
router.put("/update", updateDiagnostic); // PUT /api/diagnostic/update

module.exports = router;
