/**
 * @file apartment.js
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

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const mod = require('../../middleware/moderator');
const Building = require('../../models/Building');
const Apartment = require('../../models/Apartment');
const sameBuildingMod = require('../../middleware/sameBuildingMod');
const { check, validationResult } = require('express-validator');
const Expense = require('../../models/Expense');

// @route    GET api/apartment/:id
// @desc     Get a single apartment by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id).lean();
    if (!apartment) return res.status(404).json({ msg: 'Apartment not found' });

    const building = await Building.findById(apartment.building).lean();
    const {
      permissions,
      apartment: userApt,
      building: userBuilding,
    } = req.decoded;

    if (permissions.admin) return res.json(apartment);

    // Moderator of the same building
    if (permissions.moderator && userBuilding?.id === building._id.toString()) {
      return res.json(apartment);
    }

    // Resident accessing their own apartment
    if (userApt?.id === apartment._id.toString()) {
      return res.json(apartment);
    }

    return res.status(403).json({ msg: 'User not authorized' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/apartment/building/:id
// @desc     Get all apartments in a building
// @access   Private
router.get('/building/:id', auth, async (req, res) => {
  try {
    const building = await Building.findById(req.params.id).lean();
    const { permissions, building: userBuilding } = req.decoded;

    if (
      !permissions.admin &&
      (!permissions.moderator || userBuilding?.id !== building._id.toString())
    ) {
      return res.status(403).json({ msg: 'User not authorized' });
    }

    const apartments = await Apartment.find({
      building: building._id,
      deleted_at: null,
    })
      .select('-pin -__v -createdAt -updatedAt -is_moderator')
      .lean();

    res.json(apartments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/apartment
// @desc     Get all apartments
// @access   Private/Admin
router.get('/', [auth, admin], async (req, res) => {
  try {
    const apartments = await Apartment.find({ deleted_at: null })
      .select('-pin -__v -createdAt -updatedAt')
      .lean();

    res.json(apartments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/apartment
// @desc     Create an apartment
// @access   Private/Moderator
router.post(
  '/',
  [
    auth,
    mod,
    sameBuildingMod,
    check('pin', 'PIN must be 4-digit numeric')
      .isLength({ min: 4, max: 4 })
      .isNumeric(),
    check('apartment_number', 'Apartment number is required').isNumeric(),
    check('building', 'Building ID is required').not().isEmpty(),
  ],
  async (req, res) => {
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
    } catch (err) {
      console.error(err.message);

      if (err.code === 11000) {
        return res.status(400).json({ msg: 'PIN already exists' });
      }

      if (err.name === 'CastError') {
        return res.status(400).json({ msg: 'Invalid Building ID' });
      }

      res.status(500).send('Server Error');
    }
  }
);


// @route    POST api/apartment/exists
// @desc     Check if apatment exists
// @access   Public 
router.post('/exists', async (req, res) => {
  try {
    const { id } = req.body;
    //See if apartment exists
    let apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    } else {
      return res.status(200).json({ msg: 'Apartment found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
);


// @route    DELETE api/apartment/:building/:number
// @desc     Soft delete an apartment
// @access   Private/Moderator
// Soft Delete Apartment
router.delete('/:email', async (req, res) => {
  try {
    const apartment = await Apartment.findOne({ email: req.params.email });
    if (!apartment) return res.status(404).json({ msg: 'Apartment not found' });

    await apartment.softDelete();
    await Expense.updateMany(
      { apartment: apartment._id },
      { deleted_at: new Date() }
    );

    res.json({ msg: 'Apartment and related expenses deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Restore Apartment
router.patch('/:email', async (req, res) => {
  try {
    const apartment = await Apartment.findOne({ email: req.params.email });
    if (!apartment) return res.status(404).json({ msg: 'Apartment not found' });

    await apartment.restore();
    await Expense.updateMany(
      { apartment: apartment._id },
      { deleted_at: null, createdAt: new Date() }
    );

    res.json({ msg: 'Apartment and related expenses restored' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
module.exports = router;
