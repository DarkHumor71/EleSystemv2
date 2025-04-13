const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const Apartment = require('../../models/Apartment');
const Building = require('../../models/Building');
const building = require('../../middleware/building');

// @route    GET api/auth
// @desc     Get authenticated apartment/building info based on user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    // If apartment is not found, check building data
    if (req.decoded.apartment) {
      const apartment = await Apartment.findById(
        req.decoded.apartment.id
      ).select('-pin');
      return res.json(apartment);
    } else if (req.decoded.building) {
      const building = await Building.findById(req.decoded.building.id).select(
        '-password'
      );
      return res.json(building);
    }

    return res
      .status(400)
      .json({ msg: 'No valid apartment or building found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate apartment via PIN and return JWT token with permissions
// @access   Public
router.post(
  '/',
  [
    // Validate PIN input
    check('pin', 'PIN is required and must be exactly 4 numeric characters')
      .exists()
      .isLength({ min: 4, max: 4 })
      .isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pin } = req.body;
    try {
      // Check if apartment exists with the provided PIN
      let apartment = await Apartment.findOne({ pin });
      if (!apartment) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      req.decoded.apartment = { id: apartment.id };

      // Set user permissions based on apartment's role
      if (!req.decoded.permissions) {
        req.decoded.permissions = {}; // Initialize permissions if not already set
      }

      // Assign permissions based on the apartment's role
      if (apartment.is_moderator) {
        req.decoded.permissions.moderator = true;
        req.decoded.permissions.resident = true;
      } else {
        req.decoded.permissions.resident = true;
        req.decoded.permissions.moderator = false;
      }

      // Create payload for JWT token
      const payload = {
        ...req.decoded,
        permissions: {
          moderator: req.decoded.permissions.moderator,
          resident: req.decoded.permissions.resident,
        },
      };

      // Generate and return the JWT token
      jwt.sign(payload, config.get('jwtSecret'), (err, token) => {
        if (err) throw err;
        res.json({
          token,
          moderator: req.decoded.permissions.moderator,
          resident: req.decoded.permissions.resident,
          building: req.decoded.building?.id || null,
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
