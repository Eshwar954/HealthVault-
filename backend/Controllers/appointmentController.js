const Appointment = require("../models/Appointment");
const AccessGrant = require("../models/AccessGrant");
const User = require("../models/User");

const populateAppointment = (query) =>
  query
    .populate("patientId", "name email loginId phone")
    .populate("doctorId", "name email specialization clinicAddress");

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, scheduledAt, reason } = req.body;

    if (!doctorId || !scheduledAt) {
      return res.status(400).json({ message: "Doctor and appointment time are required" });
    }

    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointmentDate = new Date(scheduledAt);
    if (Number.isNaN(appointmentDate.getTime()) || appointmentDate <= new Date()) {
      return res.status(400).json({ message: "Appointment time must be in the future" });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      scheduledAt: appointmentDate,
      reason,
    });

    const populated = await populateAppointment(Appointment.findById(appointment._id));
    res.status(201).json({ appointment: populated });
  } catch (error) {
    console.error("Book appointment error:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await populateAppointment(
      Appointment.find({ patientId: req.user._id }).sort({ scheduledAt: -1 })
    );
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await populateAppointment(
      Appointment.find({ doctorId: req.user._id }).sort({ scheduledAt: -1 })
    );
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

const acceptAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!appointment.doctorId.equals(req.user._id)) {
      return res.status(403).json({ message: "Not your appointment" });
    }

    const validFrom = new Date(appointment.scheduledAt);
    const validUntil = new Date(validFrom.getTime() + 24 * 60 * 60 * 1000);

    const grant = await AccessGrant.findOneAndUpdate(
      {
        patientId: appointment.patientId,
        granteeId: appointment.doctorId,
        sourceType: "appointment",
        sourceId: appointment._id,
      },
      {
        patientId: appointment.patientId,
        granteeId: appointment.doctorId,
        granteeRole: "doctor",
        sourceType: "appointment",
        sourceId: appointment._id,
        scope: ["view_records", "upload_records"],
        validFrom,
        validUntil,
        status: "active",
      },
      { upsert: true, new: true }
    );

    appointment.status = "accepted";
    appointment.accessGrantId = grant._id;
    await appointment.save();

    const populated = await populateAppointment(Appointment.findById(appointment._id));
    res.json({ appointment: populated, accessGrant: grant });
  } catch (error) {
    console.error("Accept appointment error:", error);
    res.status(500).json({ message: "Failed to accept appointment" });
  }
};

const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!appointment.doctorId.equals(req.user._id)) {
      return res.status(403).json({ message: "Not your appointment" });
    }

    appointment.status = "rejected";
    await appointment.save();
    await AccessGrant.updateOne(
      { sourceType: "appointment", sourceId: appointment._id },
      { $set: { status: "revoked" } }
    );

    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject appointment" });
  }
};

const revokeAppointmentAccess = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!appointment.patientId.equals(req.user._id)) {
      return res.status(403).json({ message: "Not your appointment" });
    }

    await AccessGrant.updateOne(
      { sourceType: "appointment", sourceId: appointment._id },
      { $set: { status: "revoked" } }
    );

    res.json({ message: "Access revoked" });
  } catch (error) {
    res.status(500).json({ message: "Failed to revoke access" });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  acceptAppointment,
  rejectAppointment,
  revokeAppointmentAccess,
};
