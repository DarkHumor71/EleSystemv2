/**
 * @file Session.js
 * @description Mongoose schema for Session.
 *
 * @module models/Session
 */

const mongoose = require('mongoose');

/**
 * Session Schema
 * Represents the electricity usage data (in time, power, and cost) for an apartment.
 * Supports soft delete functionality.
 */
const SessionSchema = new mongoose.Schema(
  {
    /**
     * @type {String}
     */
    _id: {
      type: String,
    },

    /**
     * Reference to the apartment this session belongs to.
     * @type {mongoose.Types.ObjectId}
     */
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
    },
  },
);

/** Session model based on the schema */
const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
