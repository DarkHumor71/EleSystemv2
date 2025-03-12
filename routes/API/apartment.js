const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const Building = require("../../models/Building");
const Apartment = require("../../models/Apartment");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");
const mod = require("../../middleware/moderator");
//@route    GET api/apartment
//@desc     GET a Apartment
//@access   Private

router.get("/:id", auth, async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ msg: "apartment not found" });
    const building = await Building.findById(apartment.building);
    const perm = req.decoded.permissions;
    //moderator case
    if (perm.moderator && req.decoded.building.id !== building.id.toString()) {
      return res.status(401).json({ msg: "User not b authorized" });
    }
    //resident case
    if (!perm.admin && apartment.id.toString() !== req.decoded.apartment.id)
      return res.status(401).json({ msg: "User not a authorized" });

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
router.get("/building/:id", [auth], async (req, res) => {
  try {
    const building = await Building.findById(req.decoded.building.id);
    const perm = req.decoded.permissions;
    if (
      perm.admin ||
      (perm.moderator && req.decoded.building.id !== building.id.toString())
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
    const apartments = await Apartment.find({ deleted_at: null }).select(
      "-pin -__v -createdAt -updatedAt"
    );
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
    auth,
    mod,
    check("pin", "PIN is required and must be exactly 4 characters long")
      .isLength({ min: 4, max: 4 })
      .isNumeric()
      .withMessage("PIN must be numeric"),
    check("apartment_number", "number is required")
      .isNumeric()
      .withMessage("number must be numeric"),
    check("building", "Building ID is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { building, pin, first_name, last_name, apartment_number, email } =
        req.body;

      // Create the new apartment
      const newApartment = new Apartment({
        building: building,
        pin: pin,
        first_name: first_name,
        last_name: last_name,
        apartment_number: apartment_number,
        email: email,
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
