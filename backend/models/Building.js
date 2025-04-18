/**
 * @file Building.js
 * @description Mongoose schema for a building, including the ability to soft delete and restore.
 *
 * @module models/Building
 */

const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Building Schema
 * Represents a building which can have multiple apartments. 
 * Includes details like name, address, and email. Supports soft delete.
 */
const BuildingSchema = new Schema(
    {
        /** Name of the building */
        name: {
            type: String,
        },

        /** Unique email for the building */
        email: {
            type: String,
            required: true,
            unique: true,
        },

        /** Address of the building */
        address: {
            type: String,
        },

        /** State where the building is located */
        state: {
            type: String,
        },

        /** City where the building is located */
        city: {
            type: String,
        },

        /** Marks if the building is soft-deleted */
        deleted_at: {
            type: Date,
            default: null,
        },

        /** Password for the building, if any */
        password: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, // Automatically includes createdAt and updatedAt fields
    }
);

/**
 * Soft delete the building (sets `deleted_at` to current date).
 * @method
 * @returns {Promise<Document>} The updated document.
 */
BuildingSchema.methods.softDelete = function () {
    this.deleted_at = new Date();
    return this.save();
};

/**
 * Restore a soft-deleted building (clears `deleted_at` and resets `createdAt`).
 * @method
 * @returns {Promise<Document>} The updated document.
 */
BuildingSchema.methods.restore = function () {
    this.deleted_at = null;
    this.createdAt = new Date();
    return this.save();
};

module.exports = Building = mongoose.model("building", BuildingSchema);
