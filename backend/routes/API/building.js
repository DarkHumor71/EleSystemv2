const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const Building = require("../../models/Building");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const Apartment = require("../../models/Apartment");

// @route    GET api/building/:id
// @desc     GET a Building by ID
// @access   Private
router.get("/:id", auth, async (req, res) => {
    try {
        let building;

        if (req.permissions.admin) {
            building = await Building.findOne({ _id: req.params.id, deleted_at: null });
            if (!building) {
                return res.status(404).json({ msg: "Building not found" });
            }
        }

        if (req.permissions.moderator) {
            const apartment = await Apartment.findOne({ _id: req.apartment.id, deleted_at: null });

            if (!apartment || apartment.building.toString() !== req.params.id) {
                return res.status(403).json({ msg: "Not authorized to view this building" });
            }

            building = await Building.findOne({ _id: req.params.id, deleted_at: null });
            if (!building) {
                return res.status(404).json({ msg: "Building not found" });
            }
        }

        res.json(building);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route    POST api/building (Login)
// @desc     Login to building
// @access   Public
router.post(
    "/",
    check("email", "Email is required").exists(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;
            let admin = false;
            let admin_building = null;

            const building = await Building.findOne({ email, deleted_at: null });
            if (!building) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            if (building.password) {
                if (!password) {
                    admin_building = true;
                } else {
                    const isMatch = await bcrypt.compare(password, building.password);
                    if (!isMatch) {
                        return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
                    }
                    admin = true;
                }
            } else if (password) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            const payload = {
                building: { id: building.id },
                permissions: {
                    admin,
                    moderator: admin,
                },
            };

            jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                if (admin_building) return res.json({ token, admin_building });
                res.json({ token });
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route    GET api/building
// @desc     Get all Buildings
// @access   Private/Admin
router.get("/", [auth, admin], async (req, res) => {
    try {
        const buildings = await Building.find({ deleted_at: null })
            .select("-password -__v -createdAt -updatedAt")
            .lean();
        res.json(buildings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route    POST api/building/create
// @desc     Create a new Building + first Apartment (moderator)
// @access   Private
router.post("/create", [auth, check('pin', 'PIN must be 4-digit numeric')
    .isLength({ min: 4, max: 4 })
    .isNumeric(),
    check('apartment_number', 'Apartment number is required').isNumeric()], async (req, res) => {
        const { name, address, city, state, password, pin, first_name, last_name, apartment_number, email } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const session = mongoose.startSession();
        try {
            session.startTransaction();

            const newBuilding = new Building({ name, email, address, city, state });

            if (password) {
                const salt = await bcrypt.genSalt(10);
                newBuilding.password = await bcrypt.hash(password, salt);
            }

            const building = await newBuilding.save({ session });

            const newApartment = new Apartment({
                building: building._id,
                pin,
                first_name,
                last_name,
                apartment_number,
                email,
                is_moderator: true,
            });

            const apartment = await newApartment.save({ session });

            await session.commitTransaction();
            res.json({ apartment, building });
        } catch (err) {
            await session.abortTransaction();
            console.error(err.message);
            res.status(500).send("Server Error");
        } finally {
            session.endSession();
        }
    });

// @route    DELETE api/building/:email
// @desc     Soft delete a building by email
// @access   Private/Admin
router.delete("/:email", [auth, admin], async (req, res) => {
    try {
        const building = await Building.findOne({ email: req.params.email });

        if (!building) {
            return res.status(404).json({ msg: "Building not found" });
        }

        await building.softDelete();
        res.json({ msg: "Building deleted", building });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
