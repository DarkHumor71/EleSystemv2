/**
 * @file sameBuildingMod.js
 * @description Middleware to restrict moderator actions to their own building. It verifies that
 * the authenticated moderator belongs to the same building as the target resource (typically identified
 * in the JWT payload). Admins are not blocked by this middleware.
 *
 * This middleware:
 * - Fetches the moderator's apartment if it's not already present.
 * - Compares the moderator's building ID with the target building ID from the JWT.
 * - Grants access only if the moderator belongs to the same building.
 * 
 * @module middleware/sameBuildingMod
 * @function
 * @param {Object} req - Express request object. Must include `decoded.apartment` and `decoded.building`.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to pass control to the next middleware or route.
 * 
 * @returns {Object} 403 response if the moderator does not belong to the target building.
 * @returns {Object} 500 response on server error.
 */

const Apartment = require("../models/Apartment");

module.exports = async function (req, res, next) {
    try {
        const { apartment, building } = req.decoded;

        // Fetch the apartment if not included in the token
        const modApartment = apartment?.id
            ? await Apartment.findById(apartment.id)
            : null;

        if (!modApartment) {
            return res.status(403).json({ msg: "Moderator apartment not found" });
        }

        // Ensure the moderator belongs to the same building (from route param or body)
        const targetBuildingId = building;

        if (!targetBuildingId || modApartment.building.toString() !== targetBuildingId.toString()) {
            return res.status(403).json({ msg: "Access denied: not your building" });
        }

        next();
    } catch (err) {
        console.error("sameBuildingMod error:", err.message);
        res.status(500).send("Server Error");
    }
};
