/**
 * @file Building.js
 * @description Mongoose schema for a building, including the ability to soft delete and restore.
 *
 * @module models/Building
 */

import mongoose, { Document, Model, Schema } from "mongoose";
import type { Building as BuildingType } from "../types";
/**
 * Building Schema
 * Represents a building which can have multiple apartments.
 * Includes details like name, address, and email. Supports soft delete.
 */

const BuildingSchema: Schema<BuildingType> = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    state: { type: String },
    city: { type: String },
    deleted_at: { type: Date, default: null },
    password: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

/**
 * Soft delete the building (sets `deleted_at` to current date).
 * @method
 * @returns {Promise<Document>} The updated document.
 */

BuildingSchema.methods.softDelete = function (): Promise<BuildingType> {
  this.deleted_at = new Date();
  return this.save();
};

/**
 * Restore a soft-deleted building (clears `deleted_at` and resets `createdAt`).
 * @method
 * @returns {Promise<Document>} The updated document.
 */

BuildingSchema.methods.restore = function (): Promise<BuildingType> {
  this.deleted_at = null;
  this.createdAt = new Date();
  return this.save();
};

const Building: Model<BuildingType> = mongoose.model<BuildingType>(
  "building",
  BuildingSchema
);
export default Building;
