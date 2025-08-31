import { Request, Response, NextFunction } from "express";
import { AdminRequest } from "../types";
// Define AdminRequest type extending Express Request with 'decoded' property

/**
 * Middleware to authorize admin-level access.
 */

const admin = (req: AdminRequest, res: Response, next: NextFunction): void => {
  const permissions = req.decoded?.permissions;
  if (!permissions?.DecodedPermissions?.admin) {
    res.status(401).json({ msg: "Not authorized: admin access required" });
    return;
  }
  next();
};

export default admin;
