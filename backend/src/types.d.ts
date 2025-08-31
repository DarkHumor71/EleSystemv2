import "express";
import mongoose, { Schema } from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    decoded?: {
      permissions?: DecodedPermissions;
    };
  }
}
interface DecodedPermissions {
  admin?: boolean;
  moderator?: boolean;
  resident?: boolean;

  [key: string]: any;
}
interface Building extends Document {
  name?: string;
  email: string;
  address?: string;
  state?: string;
  city?: string;
  deleted_at?: Date | null;
  password?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  softDelete(): Promise<Building>;
  restore(): Promise<Building>;
}
interface Expense extends Document {
  deleted_at?: Date | null;
  apartment: mongoose.Types.ObjectId;
  time: mongoose.Types.Decimal128;
  power: mongoose.Types.Decimal128;
  cost: mongoose.Types.Decimal128;
  createdAt?: Date;
  updatedAt?: Date;
  softDelete(): Promise<Expense>;
  restore(): Promise<Expense>;
}
export interface Apartment extends Document {
  pin: string;
  building: Schema.Types.ObjectId;
  apartment_number: number;
  deleted_at?: Date | null;
  is_moderator: boolean;
  first_name: string;
  last_name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  softDelete(): Promise<Apartment>;
  restore(): Promise<Apartment>;
}
interface DecodedToken {
  permissions?: { DecodedPermissions };
  building?: { id?: string };
  apartment?: { id?: string };
}
interface AdminRequest extends Request {
  decoded?: {
    permissions?: { DecodedPermissions };
    [key: string]: any;
  };
}
interface DecodedPayload {
  permissions?: any;
  apartment?: { id?: string };
  building?: string;
  [key: string]: any;
}

interface AuthRequest extends Request {
  decoded?: DecodedPayload;
}
interface BuildingRequest extends Request {
  building?: any;
  // Removed duplicate DecodedPermissions interface
}

interface ModeratorRequest extends Request {
  decoded?: {
    permissions?: DecodedPermissions;
  };
}

interface BuildingRequest extends Request {
  decoded?: DecodedPayload;
}
