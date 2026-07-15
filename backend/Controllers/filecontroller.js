const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const File = require("../models/userfile");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const AccessGrant = require("../models/AccessGrant");
const DiagnosticOrder = require("../models/DiagnosticOrder");
const AuditLog = require("../models/AuditLog");

const fileProjection =
  "fileUrl fileType fileName doctorName diagnosticCenterName reportType createdAt updatedAt loginId";

const logAction = async ({
  req,
  patientId,
  action,
  resourceType,
  resourceId,
  sourceType,
  sourceId,
}) => {
  try {
    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      patientId,
      action,
      resourceType,
      resourceId,
      sourceType,
      sourceId,
      ipAddress: req.ip,
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};

const uploadToCloudinary = async (req) => {
  if (!req.file) {
    const error = new Error("File is required");
    error.status = 400;
    throw error;
  }

  try {
    return await cloudinary.uploader.upload(req.file.path, {
      resource_type: req.file.mimetype === "application/pdf" ? "raw" : "auto",
    });
  } finally {
    fs.promises.unlink(req.file.path).catch(() => {});
  }
};

const createFile = async ({
  req,
  loginId,
  doctorName,
  diagnosticCenterName,
  reportType,
  patientUser,
  sourceType,
  sourceId,
}) => {
  const result = await uploadToCloudinary(req);
  const file = await File.create({
    loginId,
    fileUrl: result.secure_url,
    fileType: req.file.mimetype,
    fileName: req.body.fileName || req.file.originalname,
    doctorName,
    diagnosticCenterName,
    reportType,
  });

  await logAction({
    req,
    patientId: patientUser._id,
    action: "upload_record",
    resourceType: "file",
    resourceId: file._id,
    sourceType,
    sourceId,
  });

  return file;
};

const getFilesForLoginId = async (loginId, limit = 50) =>
  File.find({ loginId })
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 50, 100))
    .select(fileProjection);

const uploadFile = async (req, res) => {
  try {
    const { doctorName, reportType } = req.body;

    if (!doctorName || !reportType) {
      return res
        .status(400)
        .json({ message: "Doctor name and report type are required" });
    }

    const file = await createFile({
      req,
      loginId: req.user.loginId,
      doctorName,
      reportType,
      patientUser: req.user,
      sourceType: "patient_upload",
      sourceId: req.user._id,
    });

    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (error) {
    console.error("Upload error:", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "File upload failed" });
  }
};

const getMyFiles = async (req, res) => {
  try {
    const files = await getFilesForLoginId(req.user.loginId, req.query.limit);
    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch files" });
  }
};

const getAppointmentRecords = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "name email loginId")
      .populate("doctorId", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!appointment.doctorId._id.equals(req.user._id)) {
      return res.status(403).json({ message: "Not your appointment" });
    }

    if (appointment.status !== "accepted") {
      return res.status(403).json({ message: "Appointment is not accepted" });
    }

    const now = new Date();
    const grant = await AccessGrant.findOne({
      _id: appointment.accessGrantId,
      granteeId: req.user._id,
      status: "active",
      validFrom: { $lte: now },
      validUntil: { $gte: now },
    });

    if (!grant) {
      return res.status(403).json({ message: "Record access is not active" });
    }

    const files = await getFilesForLoginId(appointment.patientId.loginId, req.query.limit);

    await logAction({
      req,
      patientId: appointment.patientId._id,
      action: "view_records",
      resourceType: "appointment",
      resourceId: appointment._id,
      sourceType: "appointment",
      sourceId: appointment._id,
    });

    res.json({
      appointment: {
        _id: appointment._id,
        patient: appointment.patientId,
        scheduledAt: appointment.scheduledAt,
        status: appointment.status,
        accessValidUntil: grant.validUntil,
      },
      records: files,
    });
  } catch (error) {
    console.error("Failed to fetch appointment records:", error);
    res.status(500).json({ message: "Failed to fetch appointment records" });
  }
};

const uploadAppointmentRecord = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "patientId",
      "name email loginId"
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!appointment.doctorId.equals(req.user._id)) {
      return res.status(403).json({ message: "Not your appointment" });
    }

    const now = new Date();
    const grant = await AccessGrant.findOne({
      _id: appointment.accessGrantId,
      granteeId: req.user._id,
      scope: "upload_records",
      status: "active",
      validFrom: { $lte: now },
      validUntil: { $gte: now },
    });

    if (!grant) {
      return res.status(403).json({ message: "Upload access is not active" });
    }

    const { reportType } = req.body;
    if (!reportType) {
      return res.status(400).json({ message: "Report type is required" });
    }

    const file = await createFile({
      req,
      loginId: appointment.patientId.loginId,
      doctorName: req.user.name,
      reportType,
      patientUser: appointment.patientId,
      sourceType: "appointment",
      sourceId: appointment._id,
    });

    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (error) {
    console.error("Appointment upload error:", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "File upload failed" });
  }
};

const uploadDiagnosticOrderReport = async (req, res) => {
  try {
    const order = await DiagnosticOrder.findById(req.params.id).populate(
      "patientId",
      "name email loginId"
    );

    if (!order) {
      return res.status(404).json({ message: "Diagnostic order not found" });
    }

    if (!order.diagnosticCenterId.equals(req.user._id)) {
      return res.status(403).json({ message: "Not your diagnostic order" });
    }

    if (order.status === "completed" || order.status === "cancelled") {
      return res.status(400).json({ message: "Diagnostic order is closed" });
    }

    const reportType = req.body.reportType || order.tests?.[0] || "General Checkup";
    const file = await createFile({
      req,
      loginId: order.patientId.loginId,
      doctorName: req.body.doctorName || "Diagnostic Center",
      diagnosticCenterName: req.user.name,
      reportType,
      patientUser: order.patientId,
      sourceType: "diagnostic_order",
      sourceId: order._id,
    });

    order.status = "completed";
    await order.save();

    res.status(201).json({ message: "Report uploaded successfully", file, order });
  } catch (error) {
    console.error("Diagnostic report upload error:", error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Report upload failed" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.loginId !== req.user.loginId) {
      return res.status(403).json({ message: "You can only delete your own files" });
    }

    const publicId = file.fileUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    await File.findByIdAndDelete(file._id);

    await logAction({
      req,
      patientId: req.user._id,
      action: "delete_record",
      resourceType: "file",
      resourceId: file._id,
      sourceType: "patient_action",
      sourceId: req.user._id,
    });

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Failed to delete file:", error);
    res.status(500).json({ message: "Failed to delete file" });
  }
};

const getFilesByLoginId = async (req, res) => {
  if (!req.user || req.user.role !== "user" || req.user.loginId !== req.params.loginId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const files = await getFilesForLoginId(req.user.loginId, 5);
  res.status(200).json({ files });
};

const getFilesuserboard = getFilesByLoginId;

module.exports = {
  uploadFile,
  getMyFiles,
  getAppointmentRecords,
  uploadAppointmentRecord,
  uploadDiagnosticOrderReport,
  getFilesByLoginId,
  deleteFile,
  getFilesuserboard,
};
