const User = require('../models/User');

// ✅ Get User Details by ID or Email
const getUser = async (req, res) => {
  try {
    const { userId, email, loginId } = req.query;

    if (!userId && !email && !loginId) {
      return res.status(400).json({ message: 'User identifier (userId, email, or loginId) is required' });
    }

    let query = {};
    if (userId) query._id = userId;
    if (email) query.email = email;
    if (loginId) query.loginId = loginId;

    const user = await User.findOne(query).select('-password'); // Exclude password for security

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  getUser
};
