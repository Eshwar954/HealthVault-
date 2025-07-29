const express = require("express");
const router = express.Router();
const {
  getDiagnostic,
  updateDiagnostic
} = require("../controllers/diagnosticController");

router.get("/", getDiagnostic); // GET /api/diagnostic?email=...
router.put("/update", updateDiagnostic); // PUT /api/diagnostic/update

module.exports = router;
