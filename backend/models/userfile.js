const mongoose = require('mongoose');

const userfileSchema = new mongoose.Schema(
    {
        loginId: {
            type: String,
            required: true,
            ref: 'User', // Links to the User collection based on loginId
        },
        fileUrl: {
            type: String,
            required: true,
        },
        fileType: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        doctorName: {  // New field
            type: String,
            required: true,
        },
        diagnosticCenterName: {
            type: String,
          },          
        reportType: {  // New field
            type: String,
            required: true,
            enum: [
                // General
                "General Checkup", "Prescription", "Discharge Summary", "Medical Certificate",
        
                // Lab Tests
                "Blood Test", "Urine Test", "Stool Test", "Liver Function Test (LFT)",
                "Kidney Function Test (KFT)", "Thyroid Profile", "Lipid Profile",
                "HbA1c (Diabetes)", "Complete Blood Count (CBC)",
        
                // Specialist Reports
                "Cardiology", "Neurology", "Orthopedics", "Gastroenterology", "Dermatology",
                "Pulmonology", "Endocrinology", "Nephrology", "Urology", "ENT (Ear, Nose, Throat)",
        
                // Imaging & Diagnostics
                "X-Ray", "MRI", "CT Scan", "Ultrasound", "Echocardiogram (ECHO)",
                "ECG", "EEG", "PET Scan", "Mammogram",
        
                // Miscellaneous
                "Vaccination Record", "Allergy Test", "Mental Health Evaluation",
                "Vision Test", "Hearing Test", "Dental Report", "Gynecology", "Pediatrics"
              ],// Add more if needed
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const File = mongoose.model('File', userfileSchema);

module.exports = File;
