/**
 * @file Session.js
 * @description Mongoose schema for Session.
 *
 * @module models/Session
 */

import mongoose, { Document, Model, Schema, Types } from "mongoose";

/**
 * Session Schema
 * Represents the electricity usage data (in time, power, and cost) for an apartment.
 * Supports soft delete functionality.
 */

/**
 * @typedef {Object} ISession
 * @property {string} _id
 * @property {mongoose.Types.ObjectId} apartment
 */
const SessionSchema = new mongoose.Schema({
  _id: { type: String },
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment" },
});

const Session = mongoose.model("Session", SessionSchema);
export default Session;
