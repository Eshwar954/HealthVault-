const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URL || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Neither MONGO_URL nor MONGO_URI is defined in environment variables");
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected to:', mongoUri.split('@')[1] || 'database');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
  }
};

module.exports = connectDB;
