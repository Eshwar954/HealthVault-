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
            trim: true,
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
