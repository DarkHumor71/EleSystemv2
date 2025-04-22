/**
 * @file db.js
 * @description Establishes a connection to the MongoDB database using Mongoose.
 */

const { mongoose } = require('mongoose');
const config = require('config');
const Session = require('../models/Session');
// Get the MongoDB connection string from config/default.json or environment
const db = config.get('mongoURI');

/**
 * @function connectDB
 * @description Connects to MongoDB using Mongoose. Logs success or exits on failure.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
    resetSessionFields();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};
const resetSessionFields = async () => {
  try {
    await Session.findByIdAndUpdate(
      'singleton',
      {
        apartment: null,
        time: 0,
      },
      { upsert: true }
    );
    console.log("Session fields reset.");
  } catch (error) {
    console.error("Error resetting session fields:", error);
  }
};

module.exports = connectDB;
