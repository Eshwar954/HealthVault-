const DiagnosticOrder = require("../models/DiagnosticOrder");
const AccessGrant = require("../models/AccessGrant");
const User = require("../models/User");

const populateOrder = (query) =>
  query
    .populate("patientId", "name email loginId")
    .populate("doctorId", "name email specialization")
    .populate("diagnosticCenterId", "name email services address");

const listDiagnosticCenters = async (req, res) => {
  try {
    const centers = await User.find({ role: "diagnostic center" })
      .select("name email services address")
      .sort({ name: 1 });
    res.json({ centers });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch diagnostic centers" });
  }
};

const createDiagnosticOrder = async (req, res) => {
  try {
    const { patientId, diagnosticCenterId, tests, notes, appointmentId } = req.body;

    if (!diagnosticCenterId || !Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({ message: "Diagnostic center and tests are required" });
    }

    let resolvedPatientId = patientId;
    if (req.user.role === "user") {
      resolvedPatientId = req.user._id;
    }

    if (!resolvedPatientId) {
      return res.status(400).json({ message: "Patient is required" });
    }

    const center = await User.findOne({ _id: diagnosticCenterId, role: "diagnostic center" });
    if (!center) {
      return res.status(404).json({ message: "Diagnostic center not found" });
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const order = await DiagnosticOrder.create({
      patientId: resolvedPatientId,
      doctorId: req.user.role === "doctor" ? req.user._id : undefined,
      diagnosticCenterId,
      appointmentId,
      tests,
      notes,
      expiresAt,
    });

    const grant = await AccessGrant.create({
      patientId: resolvedPatientId,
      granteeId: diagnosticCenterId,
      granteeRole: "diagnostic center",
      sourceType: "diagnostic_order",
      sourceId: order._id,
      scope: ["upload_records"],
      validFrom: new Date(),
      validUntil: expiresAt,
    });

    order.accessGrantId = grant._id;
    await order.save();

    const populated = await populateOrder(DiagnosticOrder.findById(order._id));
    res.status(201).json({ order: populated });
  } catch (error) {
    console.error("Create diagnostic order error:", error);
    res.status(500).json({ message: "Failed to create diagnostic order" });
  }
};

const getAssignedOrders = async (req, res) => {
  try {
    const orders = await populateOrder(
      DiagnosticOrder.find({ diagnosticCenterId: req.user._id }).sort({ createdAt: -1 })
    );
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch diagnostic orders" });
  }
};

module.exports = {
  listDiagnosticCenters,
  createDiagnosticOrder,
  getAssignedOrders,
};
