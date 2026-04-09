const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log('⚠️  No MongoDB URI found, using JSON fallback');
      return false;
    }
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    return false;
  }
};

module.exports = connectDB;
