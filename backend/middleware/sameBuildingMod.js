const Apartment = require("../models/Apartment");

module.exports = async function (req, res, next) {
    try {
        const {apartment, building} = req.decoded;

        // Fetch the apartment if not included in the token
        const modApartment = apartment?.id
            ? await Apartment.findById(apartment.id)
            : null;

        if (!modApartment) {
            return res.status(403).json({msg: "Moderator apartment not found"});
        }

        // Ensure the moderator belongs to the same building (from route param or body)
        const targetBuildingId = building;

        if (!targetBuildingId || modApartment.building.toString() !== targetBuildingId.toString()) {
            return res.status(403).json({msg: "Access denied: not your building"});
        }

        next();
    } catch (err) {
        console.error("sameBuildingMod error:", err.message);
        res.status(500).send("Server Error");
    }
};
