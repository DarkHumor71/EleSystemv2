const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const owner = require("../../middleware/owner");
const Building = require("../../models/Building");

//@route    GET api/building
//@desc     GET a Building
//@access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    res.json(building);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/building
//@desc     GET all Buildings
//@access   Private
router.get("/", [auth, owner], async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json(buildings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/building
//@desc     Create a Building
//@access   Private
router.post("/", [auth, owner], async (req, res) => {
  const { name, address, city, state, password } = req.body;
  try {
    const newBuilding = new Building({
      name,
      address,
      city,
      state,
      password,
    });

    const building = await newBuilding.save();
    res.json(building);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    DELETE api/building
//@desc     DELETE a Building
//@access   Private
router.delete("/:id", [auth, owner], async (req, res) => {
  try {
    await Building.findByIdAndRemove(req.params.id);
    res.json({ msg: "Building deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
