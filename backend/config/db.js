const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
  }
};

module.exports = connectDB;
