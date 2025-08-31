import { Request, Response, NextFunction } from "express";
import Apartment from "../models/Apartment";

/**
 * Middleware to restrict moderator actions to their own building.
 */

const sameBuildingMod = async (
  req: BuildingRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { apartment, building } = req.decoded || {};
    let modApartment: any = null;
    if (apartment?.id) {
      modApartment = await Apartment.findById(apartment.id);
    }
    if (!modApartment) {
      res.status(403).json({ msg: "Moderator apartment not found" });
      return;
    }
    const targetBuildingId = building;
    if (
      !targetBuildingId ||
      modApartment.building.toString() !== targetBuildingId.toString()
    ) {
      res.status(403).json({ msg: "Access denied: not in the same building" });
      return;
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export default sameBuildingMod;
