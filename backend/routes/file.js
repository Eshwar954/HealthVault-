const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const { uploadFile, getFilesByLoginId, deleteFile,DiagnosticuploadFile,DoctoruploadFile,getFilesuserboard ,getFiles } = require('../Controllers/filecontroller');


router.post('/upload', upload.single('file'), uploadFile);
router.get('/fetch/:loginId', getFilesByLoginId);
router.delete('/delete/:id', deleteFile); // Add this route for deleting files
router.post('/diagnostic/upload', upload.single('file'),DiagnosticuploadFile); // New route for diagnostic file upload
router.post('/doctor/upload', upload.single('file'),DoctoruploadFile); // New route for diagnostic file upload
router.get('/userboard/:loginId', getFilesuserboard); // <-- New route added here


module.exports = router;
