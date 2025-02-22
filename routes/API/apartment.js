const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const Building = require("../../models/Building");
const Apartment = require("../../models/Apartment");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");

//@route    GET api/apartment
//@desc     GET a Apartment
//@access   Private

router.get("/:id", auth, async (req, res) => {
  try {
    const apartment = await Expense.findById(req.params.id);
    if (!apartment) return res.status(404).json({ msg: "apartment not found" });
    const building = await Building.findById(apartment.building);
    const user = req.user;

    //moderator case
    if (
      user.role.toString() !== "moderator" &&
      user.building.toString() !== building.id.toString()
    ) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    //resident case
    if (apartment.id.toString() !== user.apartment.id.toString())
      return res.status(401).json({ msg: "User not authorized" });

    //default case
    res.json(apartment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "apartment not found" });

    res.status(500).send("Server Error");
  }
});

//@route    GET api/apartment
//@desc     GET all Apartments in a building
//@access   Private
router.get("/building/:id", auth, async (req, res) => {
  try {
    const building = await Building.findById(req.user.building);
    const user = req.user;
    // user check
    if (
      (user.role.toString() !== "moderator" ||
        user.role.toString() !== "admin") &&
      user.building.id.toString() !== building.id.toString()
    ) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    const apartments = await Apartment.find({ building: building.id });
    res.json(apartments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/apartment
//@desc     GET all Apartments
//@access   Private
router.get("/", [auth, admin], async (req, res) => {
  try {
    const apartments = await Apartment.find();
    res.json(apartments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/apartment
//@desc     Create a Apartment
//@access   Private
router.post(
  "/",
  [
    check("pin", "PIN is required and must be exactly 4 characters long")
      .isLength({ min: 4, max: 4 })
      .isNumeric()
      .withMessage("PIN must be numeric"),
    check("building", "Building ID is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { building, pin, is_moderator } = req.body;

      // Create the new apartment
      const newApartment = new Apartment({
        building: building,
        pin: pin,
        is_moderator: is_moderator,
      });

      // Save the apartment to the database
      const apartment = await newApartment.save();

      // Return the created apartment
      res.json(apartment);
    } catch (err) {
      console.error(err.message);

      // Handle duplicate key error (e.g., duplicate PIN)
      if (err.code === 11000) {
        return res.status(400).json({ msg: "PIN already exists" });
      }

      // Handle invalid ObjectId error
      if (err.name === "CastError") {
        return res.status(400).json({ msg: "Invalid Building ID" });
      }

      res.status(500).send("Server Error");
    }
  }
);
//@route DELETE api/apartment
//@desc DELETE a apartment
//@access Private
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ msg: "Apartment not found" });
    await apartment.remove();
    res.json({ msg: "Apartment removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Apartment not found" });

    res.status(500).send("Server Error");
  }
});
module.exports = router;
