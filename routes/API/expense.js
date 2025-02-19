const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Apartment = require("../../models/Apartments");
const brain = require("../../middleware/brain");
const Expense = require("../../models/Expense");
const Building = require("../../models/Building");
const owner = require("../../middleware/owner");

//@route    POST api/expense
//@desc     Create an Expense
//@access   Private
router.expense(
  "/",
  [
    auth,
    brain,
    check("time", "Time is required").not().isEmpty(),
    check("power", "Power is required").not().isEmpty(),
    check("from_floor", "From Floor is required").not().isEmpty(),
    check("to_floor", "To Floor is required").not().isEmpty(),
    check("apartment", "Apartment is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const apartment = await apartment.findById(req.apartment.id);

      const newExpemse = new Expense({
        time: req.body.time,
        apartment: apartment.id,
        power: req.body.power,
        from_floor: req.body.from_floor,
      });

      const Expense = await newExpemse.save();
      res.json(Expense);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    GET api/expenses
//@desc     get all expenses
//@access   private

router.get("/", [auth, owner], async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/expense/:id
//@desc     get expense by id
//@access   private
router.get("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: "Expense not found" });
    const apartment = await Apartment.findById(expense.apartment);
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
    if (expense.apartment.id.toString() !== user.apartment.id.toString())
      return res.status(401).json({ msg: "User not authorized" });

    //default case
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Expense not found" });

    res.status(500).send("Server Error");
  }
});

//@route    GET api/building/expense/:id
//@desc     get expenses by building id
//@access   private

router.get("/building/:id", auth, async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) return res.status(404).json({ msg: "Building not found" });

    const user = req.user;

    // user check
    if (
      (user.role.toString() !== "moderator" ||
        user.role.toString() !== "owner") &&
      user.building.id.toString() !== building.id.toString()
    ) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const apartments = await Apartment.find({ building: req.params.id });
    const apartmentIds = apartments.map((apartment) => apartment._id);
    const expenses = await Expense.find({ apartment: { $in: apartmentIds } });

    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Building not found" });

    res.status(500).send("Server Error");
  }
});

//@route    DELETE api/expenses/:id
//@desc     delete a expense
//@access   private

router.get("/:id", [auth, owner], async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: "Expense not found" });

    await expense.remove();
    res.json({ msg: "Expense removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Expense not found" });
    res.status(500).send("Server Error");
  }
});

module.exports = router;
