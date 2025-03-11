const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const Building = require("../../models/Building");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");

//@route    GET api/building
//@desc     GET a Building
//@access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    if (req.permissions.admin) {
      const building = await Building.findById(req.params.id);
      if (!building) {
        return res.status(400).json({ msg: "Building not found" });
      }
    }
    if (req.permissions.moderator) {
      const user = await User.findById(req.user.id);
      if (!user.building) {
        return res.status(400).json({ msg: "Not authorized" });
      }
      const building = await Building.findById(req.params.id);
      if (!building) {
        return res.status(400).json({ msg: "Building not found" });
      }
    }

    res.json(building);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/building/login
//@desc     login to building
//@access   Public
router.post(
  "/",
  check("email", "email is required").exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;
      let admin = false;
      let admin_building = null;
      let building = await Building.findOne({ email });
      if (!building) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      if (building.password && req.body.password) {
        const isMatch = await bcrypt.compare(
          req.body.password,
          building.password
        );
        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
        }
        admin = true;
      } else if (building.password) {
        admin_building = true;
      } else if (!building.password && req.body.password) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      //Return jsonwebtoken
      const payload = {
        building: {
          id: building.id,
        },
        permissions: {
          admin: admin,
          moderator: admin,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          if (admin_building) res.json({ token, admin_building });
          else res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    GET api/building
//@desc     GET all Buildings
//@access   Private
router.get("/", [auth, admin], async (req, res) => {
  try {
    const buildings = await Building.find({ deleted_at: null }).select(
      "-password -__v -createdAt -updatedAt"
    );
    res.json(buildings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/building
//@desc     Create a Building
//@access   Private
router.post("/create", async (req, res) => {
  const { name, address, city, state, password, email } = req.body;
  try {
    const building = new Building({
      name,
      email,
      address,
      city,
      state,
      password,
    });
    if (password) {
      //Encrypt password

      const salt = await bcrypt.genSalt(10);

      building.password = await bcrypt.hash(password, salt);
    }
    await building.save();
    res.json(building);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    DELETE api/building
//@desc     DELETE a Building
//@access   Private
router.delete("/:email", [auth, admin], async (req, res) => {
  try {
    const email = req.params.email;

    // Find and update the building
    const building = await Building.findOneAndUpdate(
      { email },
      { deleted_at: new Date() }, // Set the deletion timestamp
      { new: true } // Return the updated document
    );

    if (!building) {
      return res.status(404).json({ msg: "Building not found" });
    }

    res.json({ msg: "Building deleted", building });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
