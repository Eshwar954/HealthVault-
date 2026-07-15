const User = require('../models/User');

const pickAllowed = (source, allowedFields) =>
    allowedFields.reduce((result, field) => {
        if (Object.prototype.hasOwnProperty.call(source, field)) {
            result[field] = source[field];
        }
        return result;
    }, {});

const userEditableFields = [
    'name',
    'phone',
    'dateOfBirth',
    'gender',
    'bloodType',
    'height',
    'weight',
    'city',
    'state',
    'emergencyContactName',
    'emergencyContactNumber',
];

const updateUser = async (req, res) => {
    try {
        const updatedData = pickAllowed(req.body, userEditableFields);

        if (updatedData.height && updatedData.weight) {
            updatedData.bmi = (updatedData.weight / ((updatedData.height / 100) ** 2)).toFixed(2);
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user._id, role: 'user' },
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
