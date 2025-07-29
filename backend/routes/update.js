const express = require('express');
const { updateUser } = require('../Controllers/updatecontroller');

const router = express.Router();

router.put('/update', updateUser);

module.exports = router; // ✅ Export router directly
