const express = require("express");
const upload = require("../config/multerConfig");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  acceptAppointment,
  rejectAppointment,
  revokeAppointmentAccess,
} = require("../Controllers/appointmentController");
const {
  getAppointmentRecords,
  uploadAppointmentRecord,
} = require("../Controllers/filecontroller");

const router = express.Router();

router.post("/", requireAuth, requireRole("user"), bookAppointment);
router.get("/me", requireAuth, requireRole("user"), getMyAppointments);
router.get("/doctor", requireAuth, requireRole("doctor"), getDoctorAppointments);
router.post("/:id/accept", requireAuth, requireRole("doctor"), acceptAppointment);
router.post("/:id/reject", requireAuth, requireRole("doctor"), rejectAppointment);
router.post("/:id/revoke-access", requireAuth, requireRole("user"), revokeAppointmentAccess);
router.get("/:id/records", requireAuth, requireRole("doctor"), getAppointmentRecords);
router.post(
  "/:id/records",
  requireAuth,
  requireRole("doctor"),
  upload.single("file"),
  uploadAppointmentRecord
);

module.exports = router;
