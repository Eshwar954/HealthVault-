const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    unique: true
  },
  loginId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Invalid email format']
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'doctor', 'diagnostic center']
  },
  age: {
    type: Number,
    min: 0
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  specialization: String,
  clinicAddress: String,
  experience: {
    type: Number,
    min: 0
  },
  services: [String],
  address: String,

  // ✅ New fields added below
  dateOfBirth: {
    type: Date
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  height: {
    type: Number, // in cm
    min: 0
  },
  weight: {
    type: Number, // in kg
    min: 0
  },
  bmi: {
    type: Number
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  emergencyContactName: {
    type: String
  },
  emergencyContactNumber: {
    type: String,
    match: [/^\d{10}$/, 'Emergency contact number must be 10 digits']
  }
});

// ✅ Auto-calculate BMI before saving
userSchema.pre('save', function(next) {
  if (!this.loginId) {
    this.loginId = this.email;
  }

  // Calculate BMI if height and weight are provided
  if (this.height && this.weight) {
    this.bmi = (this.weight / ((this.height / 100) ** 2)).toFixed(2);
  }

  next();
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
