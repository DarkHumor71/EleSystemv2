const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Apartment = require("../../models/Apartment");
const Expense = require("../../models/Expense");
const Building = require("../../models/Building");
const admin = require("../../middleware/admin");

//@route    POST api/expense
//@desc     Create an Expense
//@access   Private
router.post(
  "/",
  [
    check("brain", "Brain code is required").not().isEmpty(),
    check("time", "Time is required").not().isEmpty(),
    check("qr_code", "qr is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.brain != 1234) {
      //password is required, it must be 1234
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    try {
      const qr_code = req.body.qr_code;
      const apartment = await Apartment.findOne({
        qr_code.payload}), 
      });
      let current = 1; //admin may change this value
      let power = 24 * current;
      let energy = (power / 1000) * (req.body.time / 3600);
      let unitCost = 1; //admin may change this value
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
      res.json(expense);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    GET api/expenses
//@desc     get all expenses
//@access   private

router.get("/", [auth, admin], async (req, res) => {
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
    const perm = req.decoded.permissions;
    if (
      perm.admin ||
      (perm.moderator && req.decoded.building.id === building.id.toString()) ||
      (perm.resident && req.decoded.apartment.id === apartment.id.toString())
    ) {
      res.json(expense);
    }

    //default case
    return res.status(401).json({ msg: "User not authorized" });
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
    const perm = req.decoded.permissions;
    if (
      perm.admin ||
      (perm.moderator && req.decoded.building.id === building.id.toString())
    ) {
      const apartments = await Apartment.find({ building: req.params.id });
      const apartmentIds = apartments.map((apartment) => apartment._id);
      const expenses = await Expense.find({ apartment: { $in: apartmentIds } });

      res.json(expenses);
    }
    return res.status(401).json({ msg: "User not authorized" });
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

router.get("/:id", [auth, admin], async (req, res) => {
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
