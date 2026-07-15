const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you use User model for both users and doctors
const { updateDoctor, getDoctorMe, listDoctors } = require('../Controllers/doctorcontroller');
const { requireAuth, requireRole } = require('../middleware/auth');
// ✅ Get doctor data by email
// ✅ Get doctor data by email
// Assuming you're using Express
router.get('/', requireAuth, listDoctors);
router.get('/me', requireAuth, requireRole('doctor'), getDoctorMe);

router.get('/:email', requireAuth, async (req, res) => {
    const { email } = req.params;
  
    try {
      // Find doctor by email and role
      const doctor = await User.findOne({ email, role: 'doctor' })
        .select('-password -_id -userId -__v -services'); // Customize as needed
  
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      res.json(doctor);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// ✅ Update doctor data

router.put('/me', requireAuth, requireRole('doctor'), updateDoctor);
router.put('/update', requireAuth, requireRole('doctor'), updateDoctor);
module.exports = router;
