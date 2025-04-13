const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const mod = require('../../middleware/moderator');
const Building = require('../../models/Building');
const Apartment = require('../../models/Apartment');
const sameBuildingMod = require('../../middleware/sameBuildingMod');
const { check, validationResult } = require('express-validator');

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

// @route    DELETE api/apartment/:building/:number
// @desc     Soft delete an apartment
// @access   Private/Moderator
router.delete(
  '/:building/:number',
  [auth, mod, sameBuildingMod],
  async (req, res) => {
    try {
      const { building, number } = req.params;
      const apartmentNumber = parseInt(number, 10);

      const apartment = await Apartment.findOne({
        building,
        apartment_number: apartmentNumber,
      });
      if (!apartment) {
        return res.status(404).json({ msg: 'Apartment not found' });
      }

      await apartment.softDelete();
      res.json({ msg: 'Apartment deleted', apartment });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
