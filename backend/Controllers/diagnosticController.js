const Diagnostic = require('../models/User'); // using user model

const diagnosticEditableFields = ["name", "services", "address"];

const pickAllowed = (source, allowedFields) =>
  allowedFields.reduce((result, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      result[field] = source[field];
    }
    return result;
  }, {});

const getDiagnostic = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const diagnostic = await Diagnostic.findOne({
      email,
      role: "diagnostic center",
    }).select("-password");

    if (!diagnostic) {
      return res.status(404).json({ message: "Diagnostic not found" });
    }

    res.status(200).json({ diagnostic });
  } catch (error) {
    console.error("Error fetching diagnostic:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getDiagnosticMe = (req, res) => {
  res.status(200).json({ diagnostic: req.user });
};

const updateDiagnostic = async (req, res) => {
  try {
    if (req.user) {
      const updatedData = pickAllowed(req.body, diagnosticEditableFields);
      const updatedDiagnostic = await Diagnostic.findOneAndUpdate(
        { _id: req.user._id, role: 'diagnostic center' },
        { $set: updatedData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedDiagnostic) {
        return res.status(404).json({ message: 'Diagnostic not found or update failed' });
      }

      return res.status(200).json({ message: 'Diagnostic updated successfully', diagnostic: updatedDiagnostic });
    }

    const { email, ...updatedData } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required for updating profile' });
    }

    const updatedDiagnostic = await Diagnostic.findOneAndUpdate(
      { email },
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedDiagnostic) {
      return res.status(404).json({ message: 'Diagnostic not found or update failed' });
    }

    res.status(200).json({ message: 'Diagnostic updated successfully', diagnostic: updatedDiagnostic });
  } catch (error) {
    console.error('Error updating diagnostic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getDiagnostic,
  getDiagnosticMe,
  updateDiagnostic,
};
