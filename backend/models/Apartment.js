/**
 * @file Apartment.js
 * @description Mongoose schema for apartments within a building. Includes soft delete support,
 * unique apartment identification per building, and moderator designation.
 *
 * @module models/Apartment
 */

const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Apartment Schema
 * Represents a residential unit within a building.
 */
const ApartmentSchema = new Schema(
    {
        /** 4-digit PIN for authentication */
        pin: {
            type: String,
            required: true,
        },

        /** Reference to the parent building */
        building: {
            type: Schema.Types.ObjectId,
            ref: "building",
            required: true,
        },

        /** Numeric identifier for the apartment within the building */
        apartment_number: {
            type: Number,
            required: true,
        },

        /** Marks if the apartment is soft-deleted */
        deleted_at: {
            type: Date,
        },

        /** Indicates if the apartment is held by a moderator */
        is_moderator: {
            type: Boolean,
            default: false,
        },

        /** First name of the resident */
        first_name: {
            type: String,
            required: true,
        },

        /** Last name of the resident */
        last_name: {
            type: String,
            required: true,
        },

        /** Email of the resident */
        email: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true, // Automatically includes createdAt and updatedAt fields
    }
);

/**
 * Unique index on building and apartment_number combination
 * Ensures apartment numbers are unique within a building.
 */
ApartmentSchema.index({ building: 1, apartment_number: 1 }, { unique: true });
/**
 * Unique index on building and pin combination
 * Ensures pin are unique within a building.
 */
ApartmentSchema.index({ building: 1, pin: 1 }, { unique: true });

/**
 * Soft delete the apartment (sets `deleted_at` to current date).
 * @method
 * @returns {Promise<Document>} The updated document.
 */
ApartmentSchema.methods.softDelete = function () {
    this.deleted_at = new Date();
    return this.save();
};

/**
 * Restore a soft-deleted apartment (clears `deleted_at` and resets `createdAt`).
 * @method
 * @returns {Promise<Document>} The updated document.
 */
ApartmentSchema.methods.restore = function () {
    this.deleted_at = null;
    this.createdAt = new Date();
    return this.save();
};

module.exports = Apartment = mongoose.model("apartment", ApartmentSchema);
