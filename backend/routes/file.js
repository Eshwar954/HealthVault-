const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const {
  uploadFile,
  getMyFiles,
  getFilesByLoginId,
  deleteFile,
  getFilesuserboard,
} = require('../Controllers/filecontroller');
const { requireAuth, requireRole } = require('../middleware/auth');


router.get('/me', requireAuth, requireRole('user'), getMyFiles);
router.post('/upload', requireAuth, requireRole('user'), upload.single('file'), uploadFile);
router.delete('/:id', requireAuth, requireRole('user'), deleteFile);

// Legacy routes retained for patient self-access only while the frontend migrates.
router.get('/fetch/:loginId', requireAuth, getFilesByLoginId);
router.get('/userboard/:loginId', requireAuth, getFilesuserboard);
router.delete('/delete/:id', requireAuth, requireRole('user'), deleteFile);


module.exports = router;
