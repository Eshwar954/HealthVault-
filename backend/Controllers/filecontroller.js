const cloudinary = require("../config/cloudinary");
const File = require("../models/userfile");

const uploadFile = async (req, res) => {
  try {
    const { loginId, doctorName, reportType } = req.body;

    if (!loginId || !doctorName || !reportType) {
      return res
        .status(400)
        .json({
          message: "All fields (loginId, doctorName, reportType) are required",
        });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: req.file.mimetype === "application/pdf" ? "raw" : "auto",
    });

    // Save file metadata to MongoDB
    const file = new File({
      loginId,
      fileUrl: result.secure_url,
      fileType: req.file.mimetype,
      fileName: req.file.originalname,
      doctorName,
      reportType,
    });

    await file.save();
    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (error) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ message: "File upload failed", error: error.message });
  }
};

const getFilesByLoginId = async (req, res) => {
  try {
    const { loginId } = req.params;

    if (!loginId) {
      return res.status(400).json({ message: "Login ID is required" });
    }

    const files = await File.find({ loginId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fileUrl fileType fileName doctorName reportType createdAt");
    res.status(200).json({ files });
  } catch (error) {
    console.error("Failed to fetch files:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch files", error: error.message });
  }
};



const getFilesuserboard = async (req, res) => {
  try {
    const { loginId } = req.params;
    const { limit } = req.query;  // Get limit from query parameters

    if (!loginId) {
      return res.status(400).json({ message: "Login ID is required" });
    }

    const fileLimit = parseInt(limit) || 5;  // Default to 5 if no limit is provided

    const files = await File.find({ loginId })
      .sort({ createdAt: -1 })
      .limit(fileLimit)
      .select("fileUrl fileType fileName doctorName reportType createdAt");

    res.status(200).json({ files });
  } catch (error) {
    console.error("Failed to fetch files:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch files", error: error.message });
  }
};


const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete file from Cloudinary
    const publicId = file.fileUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

    // Remove from database
    await File.findByIdAndDelete(id);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Failed to delete file:", error);
    res
      .status(500)
      .json({ message: "Failed to delete file", error: error.message });
  }
};

const DiagnosticuploadFile = async (req, res) => {
  try {
    const { loginId, doctorName, reportType, diagnosticCenterName } = req.body;

    if (!loginId || !doctorName || !reportType || !diagnosticCenterName) {
      return res.status(400).json({
        message: "All fields (loginId, doctorName, reportType, diagnosticCenterName) are required",
      });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: req.file.mimetype === "application/pdf" ? "raw" : "auto",
    });

    // Save file metadata to MongoDB
    const file = new File({
      loginId,
      fileUrl: result.secure_url,
      fileType: req.file.mimetype,
      fileName: req.file.originalname,
      doctorName,
      reportType,
      diagnosticCenterName, // new field added here
    });

    await file.save();
    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "File upload failed", error: error.message });
  }
};

const DoctoruploadFile = async (req, res) => {
  try {
    const { loginId, doctorName, reportType, diagnosticCenterName } = req.body;

    if (!loginId || !doctorName || !reportType) {
      return res.status(400).json({
        message: "All fields (loginId, doctorName, reportType, diagnosticCenterName) are required",
      });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: req.file.mimetype === "application/pdf" ? "raw" : "auto",
    });

    // Save file metadata to MongoDB
    const file = new File({
      loginId,
      fileUrl: result.secure_url,
      fileType: req.file.mimetype,
      fileName: req.file.originalname,
      doctorName,
      reportType,
      diagnosticCenterName, // new field added here
    });

    await file.save();
    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "File upload failed", error: error.message });
  }
};

module.exports = { uploadFile, getFilesByLoginId, deleteFile, DiagnosticuploadFile, DoctoruploadFile, getFilesuserboard };
