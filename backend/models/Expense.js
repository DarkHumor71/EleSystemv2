/**
 * @file Expense.js
 * @description Mongoose schema for recording apartment electricity usage expenses.
 *
 * @module models/Expense
 */

const mongoose = require("mongoose");

/**
 * Expense Schema
 * Represents the electricity usage data (in time, power, and cost) for an apartment.
 * Supports soft delete functionality.
 */
const ExpenseSchema = new mongoose.Schema(
    {
        /**
         * Marks the expense as deleted by storing the timestamp.
         * Null means the record is active.
         * @type {Date|null}
         */
        deleted_at: {
            type: Date,
            default: null,
        },

        /**
         * Reference to the apartment this expense belongs to.
         * @type {mongoose.Types.ObjectId}
         */
        apartment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Apartment",
            required: true,
        },

        /**
         * Time in seconds (Decimal128) for which power was used.
         * @type {mongoose.Types.Decimal128}
         */
        time: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },

        /**
         * Power consumed in kWh (Decimal128).
         * @type {mongoose.Types.Decimal128}
         */
        power: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },

        /**
         * Cost calculated for the usage in currency units (Decimal128).
         * @type {mongoose.Types.Decimal128}
         */
        cost: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

/**
 * Marks the expense as deleted by setting the `deleted_at` field.
 * @returns {Promise<Document>} The updated document.
 */
ExpenseSchema.methods.softDelete = function () {
    this.deleted_at = new Date();
    return this.save();
};

/**
 * Restores a previously soft-deleted expense.
 * Resets `deleted_at` and refreshes `createdAt` timestamp.
 * @returns {Promise<Document>} The updated document.
 */
ExpenseSchema.methods.restore = function () {
    this.deleted_at = null;
    this.createdAt = new Date();
    return this.save();
};

/** Expense model based on the schema */
const Expense = mongoose.model("expense", ExpenseSchema);

module.exports = Expense;
