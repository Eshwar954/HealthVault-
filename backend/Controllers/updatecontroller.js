const User = require('../models/User');
const mongoose = require('mongoose');

const updateUser = async (req, res) => {
    try {
        const { email, userId, loginId, password,bmi, ...updatedData } = req.body;

        if (!email && !userId && !loginId) {
            return res.status(400).json({ message: 'Provide email, userId, or loginId' });
        }

        let query = {};
        if (email) query.email = email;
        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Invalid user ID format' });
            }
            query._id = userId;
        }
        if (loginId) query.loginId = loginId;

        if (Object.keys(query).length === 0) {
            return res.status(400).json({ message: 'Invalid query parameters' });
        }

        if (updatedData.height && updatedData.weight) {
            updatedData.bmi = (updatedData.weight / ((updatedData.height / 100) ** 2)).toFixed(2);
        }

        const updatedUser = await User.findOneAndUpdate(
            query,
            { $set: updatedData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found or update failed' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { updateUser }; // ✅ Export properly as an object
