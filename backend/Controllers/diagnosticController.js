const Diagnostic = require('../models/user'); // using user model

const getDiagnostic = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const diagnostic = await Diagnostic.findOne({ email }).select("-password");

    if (!diagnostic) {
      return res.status(404).json({ message: "Diagnostic not found" });
    }

    res.status(200).json({ diagnostic });
  } catch (error) {
    console.error("Error fetching diagnostic:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const updateDiagnostic = async (req, res) => {
  try {
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
  updateDiagnostic,
};
