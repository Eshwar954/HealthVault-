const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { updateUser } = require('../Controllers/updatecontroller');

// ✅ Get user data by email
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update user profile (flexible)
router.put('/update', updateUser);

// ✅ Update user profile by email (legacy/specific)
router.put('/update/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { loginId, password, bmi, ...updatedData } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (updatedData.height && updatedData.weight) {
      updatedData.bmi = (updatedData.weight / ((updatedData.height / 100) ** 2)).toFixed(2);
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
