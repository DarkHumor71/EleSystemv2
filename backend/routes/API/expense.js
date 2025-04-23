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

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Apartment = require('../../models/Apartment');
const Expense = require('../../models/Expense');
const config = require('config');
const Building = require('../../models/Building');
const admin = require('../../middleware/admin');
const BRAIN_CODE = config.get('brainCode');


// @route    POST api/expense
// @desc     Create an Expense
// @access   Private
router.post(
  '/',
  [
    check('brain', 'Brain code is required').not().isEmpty(),
    check('time', 'Time is required').not().isEmpty(),
    check('qr_code', 'qr is required').not().isEmpty(),
    check('current', 'current is not valid').isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.brain !== BRAIN_CODE) {
      //password is required, it must be 1234
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    try {
      const qr_code = req.body.qr_code;
      const apartment = await Apartment.findById(qr_code);
      if (!apartment)
        return res.status(400).json({ msg: 'Apartment not found' });

      let current = req.body.current;
      let power = 24 * current;
      let energy = (power / 1000) * (req.body.time / 3600);
      let unitCost = 1; // Admin may change this value
      let cost = energy * unitCost;

      const roundToTwo = (num) =>
        Math.round((num + Number.EPSILON) * 100) / 100;

      const newExpense = new Expense({
        apartment: apartment.id,
        time: req.body.time,
        power: roundToTwo(parseFloat(energy)),
        cost: roundToTwo(parseFloat(cost)),
      });

      const expense = await newExpense.save();
      res.send("OK");
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/expenses
// @desc     Get all expenses with pagination
// @access   private
router.get('/', [auth, admin], async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 results per page
    const expenses = await Expense.find()
      .skip((page - 1) * limit) // Skip the appropriate number of results
      .limit(Number(limit)) // Limit the results to the specified number
      .sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/expense/apartment/:id
// @desc     Get expenses by apartment id
// @access   private
router.get('/apartment/:id', auth, async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ msg: 'Apartment not found' });

    const building = await Building.findById(apartment.building);
    const perm = req.decoded.permissions;

    if (
      (perm.moderator && req.decoded.building.id === building.id.toString()) ||
      (perm.resident && req.decoded.apartment.id === apartment.id.toString())
    ) {
      const expenses = await Expense.find({ apartment: apartment.id });
      if (!expenses) return res.status(404).json({ msg: 'Expense not found' });
      res.json(expenses);
    } else {
      return res.status(401).json({ msg: 'User not authorized' });
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Expense not found' });

    res.status(500).send('Server Error');
  }
});

// @route    GET api/building/expense/:id
// @desc     Get expenses by building id
// @access   private
router.get('/building/:id', auth, async (req, res) => {
  try {
    // Check if the building exists
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ msg: 'Building not found' });
    }

    // Check user permissions
    const perm = req.decoded.permissions;
    const isAuthorized =
      perm.admin ||
      (perm.moderator && req.decoded.building.id === building.id.toString());

    if (!isAuthorized) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Find all apartments in the building
    const apartments = await Apartment.find({ building: req.params.id });
    const apartmentIds = apartments.map((apartment) => apartment._id);

    // Find all expenses for the apartments
    const expenses = await Expense.find({ apartment: { $in: apartmentIds } });

    // Map apartment_number to each expense
    const expensesWithApartmentNumber = expenses.map((expense) => {
      const apartment = apartments.find((apt) =>
        apt._id.equals(expense.apartment)
      );
      return {
        apartment_number: apartment ? apartment.apartment_number : null, // Add apartment_number
        ...expense.toObject(), // Convert Mongoose document to plain object
      };
    });

    // Return the expenses with apartment numbers
    return res.json(expensesWithApartmentNumber);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Building not found' });
    }
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route    DELETE api/expenses/:id
// @desc     Delete an expense
// @access   private
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: 'Building not found' });
    }

    await expense.softDelete();
    res.json({ msg: 'Expense deleted', expense });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
