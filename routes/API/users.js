const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

//@route    POST api/users
//@desc     Test route (Register user)
//@access   Public
router.post(
  "/",
  [
    auth,
    admin,
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, apartment } = req.body;
    try {
      user = new User({
        name,
        email,
        apartment,
      });
      await user.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
