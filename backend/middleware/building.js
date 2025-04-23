/**
 * @file building.js
 * @description Middleware to validate if a building is attached to the request.
 * Typically used after building lookup logic to ensure a valid building context exists.
 * 
 * @module middleware/building
 * @function
 * @param {Object} req - Express request object. Should contain a `building` property.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 * 
 * @returns {Object} 401 response if no valid building is found on the request.
 */

module.exports = function (req, res, next) {
    const building = req.building;
    if (building === null) return res.status(401).json({ msg: "Not authorized" });
    next();
};
