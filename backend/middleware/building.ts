import { Request, Response, NextFunction } from "express";

/**
 * Middleware to validate if a building is attached to the request.
 */
const building = (
  req: BuildingRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.building == null) {
    res.status(401).json({ msg: "Not authorized: building not found" });
    return;
  }
  next();
};

export default building;
