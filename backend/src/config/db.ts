/**
 * @file db.ts
 * @description Establishes a connection to the MongoDB database using Mongoose.
 */

import mongoose from "mongoose";
import config from "config";
import Session from "../models/Session";
// Get the MongoDB connection string from config/default.json or environment
const db: string = config.get("mongoURI");

/**
 * @function connectDB
 * @description Connects to MongoDB using Mongoose. Logs success or exits on failure.
 */
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(db);
    await Session.deleteMany({}); // Clear all sessions on startup
    console.log("MongoDB Connected...");
  } catch (err: any) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
