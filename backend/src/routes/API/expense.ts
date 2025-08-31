/**
 * @file expense.js
 * @description This file defines routes related to managing expenses in the system. It includes routes for:
 * creating expenses, retrieving expenses (by apartment or building), paginated lists, and deleting expenses.
 * Role-based access control is enforced through middleware.
 *
 * Routes:
 * - POST `/api/expense` - Create a new expense (requires brain code validation).
 * - GET `/api/expense` - Get all expenses with pagination (admin-only).
 * - GET `/api/expense/apartment/:id` - Get all expenses for a specific apartment (resident or moderator of same building).
 * - GET `/api/expense/building/:id` - Get all expenses for a specific building (admin or same-building moderator).
 * - DELETE `/api/expense/:id` - Soft delete an expense (admin-only).
 *
 * @requires express - Web framework for Node.js.
 * @requires express-validator - Middleware for request validation.
 * @requires auth - Middleware for verifying JWT and decoding permissions.
 * @requires admin - Middleware to ensure admin-level access.
 * @requires Apartment - Mongoose model representing apartments.
 * @requires Expense - Mongoose model representing expenses.
 * @requires Building - Mongoose model representing buildings.
 * @requires config - Configuration management for sensitive data (like brain code).
 * @requires BRAIN_CODE - Brain code for validating expense creation requests.
 */

import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../../middleware/auth";
import admin from "../../middleware/admin";
import Apartment from "../../models/Apartment";
import Expense from "../../models/Expense";
import Building from "../../models/Building";
import Session from "../../models/Session";
import config from "config";
import mongoose from "mongoose";
import { DecodedToken } from "../types";

const BRAIN_CODE: string = config.get("brainCode");
const router = express.Router();

// @route    POST api/expense
// @desc     Create an Expense
// @access   Private
router.post(
  "/create",
  [
    check("brain", "Brain code is required").not().isEmpty(),
    check("mid", "Machine ID is required").not().isEmpty(),
    check("time", "Time is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.brain !== BRAIN_CODE) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    try {
      const mid: string = req.body.mid;
      const session = await Session.findById(mid);
      if (!session) return res.status(400).json({ msg: "Session not found" });
      const apartment = await Apartment.findById(session.apartment);
      if (!apartment)
        return res.status(400).json({ msg: "Apartment not found" });
      const power: number = req.body.power;
      const energy: number = (power / 1000) * (req.body.time / 3600);
      const unitCost: number = 0.5;
      const cost: number = energy * unitCost;
      const roundToTwo = (num: number) =>
        Math.round((num + Number.EPSILON) * 100) / 100;
      const newExpense = new Expense({
        apartment: apartment.id,
        time: req.body.time,
        power: roundToTwo(energy),
        cost: roundToTwo(cost),
      });
      await newExpense.save();
      await Session.deleteOne({ _id: mid });
      res.status(200).send("OK");
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/expenses
// @desc     Get all expenses with pagination
// @access   private
router.get("/", [auth, admin as any], async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const expenses = await Expense.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/expense/apartment/:id
// @desc     Get expenses by apartment id
// @access   private
router.get(
  "/apartment/:id",
  auth as any,
  async (req: Request, res: Response) => {
    try {
      const apartment = await Apartment.findById(req.params.id);
      if (!apartment)
        return res.status(404).json({ msg: "Apartment not found" });
      const building = await Building.findById(apartment.building);
      const decoded = req.decoded as DecodedToken;
      const perm = decoded.permissions;
      if (
        perm &&
        ((perm.DecodedPermissions?.moderator &&
          building &&
          decoded.building?.id === building.id.toString()) ||
          (perm.DecodedPermissions?.resident &&
            decoded.apartment?.id === apartment.id.toString()))
      ) {
        const expenses = await Expense.find({ apartment: apartment.id });
        if (!expenses)
          return res.status(404).json({ msg: "Expense not found" });
        res.json(expenses);
      } else {
        return res.status(401).json({ msg: "User not authorized" });
      }
    } catch (err: any) {
      console.error(err.message);
      if (err.kind === "ObjectId")
        return res.status(404).json({ msg: "Expense not found" });
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/building/expense/:id
// @desc     Get expenses by building id
// @access   private

router.get(
  "/building/:id",
  auth as any,
  async (req: Request, res: Response) => {
    try {
      const building = await Building.findById(req.params.id);
      if (!building) {
        return res.status(404).json({ msg: "Building not found" });
      }
      const decoded = req.decoded as DecodedToken;
      const perm = decoded.permissions;
      const isAuthorized =
        perm &&
        (perm.DecodedPermissions?.admin ||
          (perm.DecodedPermissions?.moderator &&
            decoded &&
            decoded.building &&
            decoded.building.id === building.id.toString()));
      if (!isAuthorized) {
        return res.status(401).json({ msg: "User not authorized" });
      }
      const apartments = await Apartment.find({ building: req.params.id });
      const apartmentIds = apartments.map((apartment) => apartment._id);
      const expenses = await Expense.find({ apartment: { $in: apartmentIds } });
      const expensesWithApartmentNumber = expenses.map((expense) => {
        const apartment = apartments.find((apt) =>
          apt._id.equals(expense.apartment)
        );
        return {
          apartment_number: apartment ? apartment.apartment_number : null,
          ...expense.toObject(),
        };
      });
      return res.json(expensesWithApartmentNumber);
    } catch (err: any) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Building not found" });
      }
      return res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route    DELETE api/expenses/:id
// @desc     Delete an expense
// @access   private
router.delete(
  "/:id",
  [auth, admin as any],
  async (req: Request, res: Response) => {
    try {
      const expense = await Expense.findById(req.params.id);
      if (!expense) {
        return res.status(404).json({ msg: "Expense not found" });
      }
      expense.deleted_at = new Date();
      await expense.save();
      res.json({ msg: "Expense deleted", expense });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

export default router;
