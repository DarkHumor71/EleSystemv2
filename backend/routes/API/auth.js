const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const Apartment = require('../../models/Apartment');
const building = require('../../middleware/building');
//@route    GET api/auth
//@desc     token to detailed Object
//@access   Public
router.get('/', auth, async (req, res) => {
  try {
    const building = await Building.findById(req.decoded.building.id).select(
      '-password'
    );
    if (!req.decoded.apartment && req.decoded.building) res.json(building);
    else {
      const apartment = await Apartment.findById(
        req.decoded.apartment.id
      ).select('-pin');
      console.log(apartment);
      const data = {
        apartment: apartment,
        building: building,
      };

      res.send(data);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    POST api/auth
//@desc     authenticate apartment and get jwt to use in private (for login)
//@access   Private
router.post(
  '/',
  [
    auth,
    building,
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
      //See if apartment exists

      let apartment = await Apartment.findOne({ pin });
      if (!apartment) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      req.decoded.apartment = { id: apartment.id };

      if (apartment.is_moderator) {
        if (!req.decoded.permissions) {
          req.decoded.permissions = {};
        }
        req.decoded.permissions.moderator = true;
        req.decoded.permissions.resident = true;
      } else {
        req.decoded.permissions.resident = true;
        req.decoded.permissions.moderator = false;
      }
      const modifiedPayload = {
        ...req.decoded,
      };
      const moderator = req.decoded.permissions.moderator;
      const resident = req.decoded.permissions.resident;
      jwt.sign(
        modifiedPayload,
        config.get('jwtSecret'),

        (err, token) => {
          if (err) throw err;
          console.log(req.decoded);
          res.json({
            token,
            moderator,
            resident,
            building: req.decoded.building.id,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
