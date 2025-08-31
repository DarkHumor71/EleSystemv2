/**
 * @file auth.ts
 * @description Authentication and authorization routes for apartments/buildings.
 *
 * Routes:
 * - GET `/api/auth` - Returns apartment or building details based on JWT token.
 * - POST `/api/auth` - Authenticates an apartment using a PIN and returns a JWT.
 * - PUT `/api/auth` - Updates apartment details (first name, last name, email).
 * - POST `/api/auth/authorize` - Verifies if an apartment with a given ID exists.
 */

import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import jwt = require("jsonwebtoken");
import config from "config";
import auth from "../../middleware/auth";
import buildingMiddleware from "../../middleware/building";
import Apartment from "../../models/Apartment";
import Building from "../../models/Building";

const router = express.Router();

// GET /api/auth - token to detailed Object
router.get("/", auth as any, async (req: Request, res: Response) => {
  try {
    // Use (req as any).decoded if your middleware attaches decoded to req
    const decoded = (req as any).decoded;
    const building = await Building.findById(decoded.building?.id).select(
      "-password -__v"
    );
    if (!decoded.apartment && decoded.building && decoded.permissions?.admin) {
      if (!building) return res.status(404).json({ msg: "Building not found" });
      const buildingObj = building.toObject();
      (buildingObj as any).is_admin = true;
      return res.json(buildingObj);
    } else {
      const apartment = await Apartment.findById(decoded.apartment?.id);
      if (!apartment)
        return res.status(404).json({ msg: "Apartment not found" });
      return res.json({ apartment, building });
    }
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST /api/auth - authenticate apartment and get jwt
router.post(
  "/",
  [
    auth as any,
    buildingMiddleware,
    check("pin", "PIN is required and must be exactly 4 numeric characters")
      .exists()
      .isLength({ min: 4, max: 4 })
      .isNumeric(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { pin } = req.body;
    try {
      const decoded = (req as any).decoded;
      let apartment = await Apartment.findOne({ pin });
      if (!apartment) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      decoded.apartment = { id: apartment.id };
      if (apartment.is_moderator) {
        decoded.permissions = decoded.permissions || {};
        decoded.permissions.moderator = true;
        decoded.permissions.resident = true;
      } else {
        decoded.permissions.resident = true;
        decoded.permissions.moderator = false;
      }
      const modifiedPayload = { ...decoded };
      const moderator = decoded.permissions.moderator;
      const resident = decoded.permissions.resident;
      jwt.sign(
        modifiedPayload,
        config.get("jwtSecret") as string,
        (err: Error | null, token: string | undefined) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Token generation error");
          }
          res.json({
            token,
            moderator,
            resident,
            building: decoded.building?.id,
          });
        }
      );
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// PUT /api/auth - Update apartment details
router.put("/", auth as any, async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email } = req.body;
    const decoded = (req as any).decoded;
    const apartment = await Apartment.findById(decoded.apartment?.id);
    if (!apartment) {
      return res.status(404).json({ msg: "Apartment not found" });
    }
    if (first_name) apartment.first_name = first_name;
    if (last_name) apartment.last_name = last_name;
    if (email) apartment.email = email;
    await apartment.save();
    res.json("Successfully updated apartment");
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
