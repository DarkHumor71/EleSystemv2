/**
 * @file Apartment.js
 * @description Mongoose schema for apartments within a building. Includes soft delete support,
 * unique apartment identification per building, and moderator designation.
 *
 * @module models/Apartment
 */

import mongoose, { Document, Schema, Model } from "mongoose";
import { Apartment as IApartment } from "../types";

/**
 * Apartment Schema
 * Represents a residential unit within a building.
 */

const ApartmentSchema = new Schema<IApartment>(
  {
    pin: { type: String, required: true },
    building: { type: Schema.Types.ObjectId, ref: "building", required: true },
    apartment_number: { type: Number, required: true },
    deleted_at: { type: Date },
    is_moderator: { type: Boolean, default: false },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

ApartmentSchema.index({ building: 1, apartment_number: 1 }, { unique: true });
ApartmentSchema.index({ building: 1, pin: 1 }, { unique: true });

ApartmentSchema.methods.softDelete = function (): Promise<IApartment> {
  this.deleted_at = new Date();
  return this.save();
};

ApartmentSchema.methods.restore = function (): Promise<IApartment> {
  this.deleted_at = null;
  this.createdAt = new Date();
  return this.save();
};

const Apartment: Model<IApartment> = mongoose.model<IApartment>(
  "apartment",
  ApartmentSchema
);
export default Apartment;
