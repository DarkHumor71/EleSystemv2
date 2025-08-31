/**
 * @file apartment.ts
 * @description This file contains routes related to managing apartment entities within buildings.
 * It handles retrieval, creation, soft deletion, and restoration of apartments. It also includes
 * role-based access control for administrators, moderators, and residents.
 *
 * Routes:
 * - GET `/api/apartment/:id` - Get details of a single apartment by its ID.
 * - GET `/api/apartment/building/:id` - Get all apartments associated with a specific building.
 * - GET `/api/apartment` - Get all apartments (admin-only access).
 * - POST `/api/apartment` - Create a new apartment (moderator access for the same building).
 * - DELETE `/api/apartment/:email` - Soft delete an apartment and its related expenses by email.
 * - PATCH `/api/apartment/:email` - Restore a previously deleted apartment and its expenses.
 *
 * @requires express - Fast, unopinionated web framework for Node.js
 * @requires express-validator - Middleware for validating and sanitizing input
 * @requires auth - Custom middleware to authenticate users via JWT
 * @requires admin - Middleware to check for administrator permissions
 * @requires mod - Middleware to check for moderator permissions
 * @requires sameBuildingMod - Middleware to ensure moderator belongs to the same building
 * @requires Apartment - Mongoose model representing an apartment
 * @requires Building - Mongoose model representing a building
 * @requires Expense - Mongoose model representing an expense (for soft delete/restore)
 */

import express from "express";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../../middleware/auth";
import admin from "../../middleware/admin";
import mod from "../../middleware/moderator";
import sameBuildingMod from "../../middleware/sameBuildingMod";
import Building from "../../models/Building";
import Apartment from "../../models/Apartment";
import Expense from "../../models/Expense";
import Session from "../../models/Session";
import config from "config";
const router = express.Router();
const BRAIN_CODE = config.get("brainCode") as string;

// GET api/apartment/:id
router.get("/:id", auth, async (req: Request, res: Response) => {
  try {
    const apartment = await Apartment.findById(req.params.id).lean();
    if (!apartment) return res.status(404).json({ msg: "Apartment not found" });
    const building = await Building.findById(apartment.building).lean();
    const {
      permissions,
      apartment: userApt,
      building: userBuilding,
    } = (req as any).decoded || {};
    if (permissions?.admin) return res.json(apartment);
    if (
      permissions?.moderator &&
      building &&
      userBuilding?.id === building._id.toString()
    ) {
      return res.json(apartment);
    }
    if (userApt?.id === apartment._id.toString()) {
      return res.json(apartment);
    }
    return res.status(403).json({ msg: "User not authorized" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET api/apartment/building/:id
router.get("/building/:id", auth, async (req: Request, res: Response) => {
  try {
    const building = await Building.findById(req.params.id).lean();
    const { permissions, building: userBuilding } = (req as any).decoded || {};
    if (
      !building ||
      (!permissions?.admin &&
        (!permissions?.moderator ||
          userBuilding?.id !== building._id.toString()))
    ) {
      return res.status(403).json({ msg: "User not authorized" });
    }
    const apartments = await Apartment.find({
      building: building._id,
      deleted_at: null,
    })
      .select("-pin -__v -createdAt -updatedAt -is_moderator")
      .lean();
    res.json(apartments);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET api/apartment
router.get("/", [auth, admin], async (req: Request, res: Response) => {
  try {
    const apartments = await Apartment.find({ deleted_at: null })
      .select("-pin -__v -createdAt -updatedAt")
      .lean();
    res.json(apartments);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST api/apartment
router.post(
  "/",
  [
    auth,
    mod,
    check("pin", "PIN must be 4-digit numeric")
      .isLength({ min: 4, max: 4 })
      .isNumeric(),
    check("apartment_number", "Apartment number is required").isNumeric(),
    check("building", "Building ID is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { building, pin, first_name, last_name, apartment_number, email } =
        req.body;
      const newApartment = new Apartment({
        building,
        pin,
        first_name,
        last_name,
        apartment_number,
        email,
      });
      const apartment = await newApartment.save();
      res.json(apartment);
    } catch (err: any) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ msg: "PIN already exists" });
      }
      if (err.name === "CastError") {
        return res.status(400).json({ msg: "Invalid Building ID" });
      }
      res.status(500).send("Server Error");
    }
  }
);

// POST api/apartment/exists
router.post(
  "/exists",
  check("mid", "Machine ID is required").not().isEmpty(),
  async (req: Request, res: Response) => {
    try {
      const { id, mid } = req.body;
      const apartment = await Apartment.findById(id);
      if (!apartment) {
        return res.status(400).json({ msg: "Apartment not found" });
      }
      const sess = new Session({ _id: mid, apartment });
      await sess.save();
      return res.status(200).send("OK");
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// DELETE api/apartment/:email
router.delete("/:email", async (req: Request, res: Response) => {
  try {
    const apartment = await Apartment.findOne({ email: req.params.email });
    if (!apartment) return res.status(404).json({ msg: "Apartment not found" });
    // Soft delete logic: set deleted_at
    apartment.deleted_at = new Date();
    await apartment.save();
    await Expense.updateMany(
      { apartment: apartment._id },
      { deleted_at: new Date() }
    );
    res.json({ msg: "Apartment and related expenses deleted" });
  } catch (err: any) {
    res.status(500).json({ msg: err.message });
  }
});

// PATCH api/apartment/:email
router.patch("/:email", async (req: Request, res: Response) => {
  try {
    const apartment = await Apartment.findOne({ email: req.params.email });
    if (!apartment) return res.status(404).json({ msg: "Apartment not found" });
    // Restore logic: unset deleted_at
    apartment.deleted_at = undefined;
    await apartment.save();
    await Expense.updateMany(
      { apartment: apartment._id },
      { deleted_at: null, createdAt: new Date() }
    );
    res.json({ msg: "Apartment and related expenses restored" });
  } catch (err: any) {
    res.status(500).json({ msg: err.message });
  }
});

// POST api/apartment/session
router.post(
  "/session",
  [
    check("brain", "Brain code is required").not().isEmpty(),
    check("mid", "Machine ID is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      if (req.body.brain !== BRAIN_CODE) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      const mid = req.body.mid;
      const session = await Session.findById(mid);
      if (!session) return res.status(404).json({ msg: "Session not found" });
      return res.send("OK");
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

export default router;
