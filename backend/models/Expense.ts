/**
 * @file Expense.js
 * @description Mongoose schema for recording apartment electricity usage expenses.
 *
 * @module models/Expense
 */

import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { Expense } from "../types";
/**
 * Expense Schema
 * Represents the electricity usage data (in time, power, and cost) for an apartment.
 * Supports soft delete functionality.
 */

export const ExpenseSchema: Schema<Expense> = new Schema(
  {
    deleted_at: { type: Date, default: null },
    apartment: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },
    time: { type: Schema.Types.Decimal128, required: true },
    power: { type: Schema.Types.Decimal128, required: true },
    cost: { type: Schema.Types.Decimal128, required: true },
  },
  {
    timestamps: true,
  }
);

/**
 * Marks the expense as deleted by setting the `deleted_at` field.
 * @returns {Promise<Document>} The updated document.
 */

ExpenseSchema.methods.softDelete = function (): Promise<Expense> {
  this.deleted_at = new Date();
  return this.save();
};

/**
 * Restores a previously soft-deleted expense.
 * Resets `deleted_at` and refreshes `createdAt` timestamp.
 * @returns {Promise<Document>} The updated document.
 */

ExpenseSchema.methods.restore = function (): Promise<Expense> {
  this.deleted_at = null;
  this.createdAt = new Date();
  return this.save();
};

const Expense: Model<Expense> = mongoose.model<Expense>(
  "expense",
  ExpenseSchema
);
export default Expense;
