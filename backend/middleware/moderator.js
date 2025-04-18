/**
 * @file moderator.js
 * @description Middleware to authorize access for users with moderator or admin permissions.
 * If the user is not a moderator (and not an admin), the request is blocked with a 403 Forbidden status.
 * 
 * @module middleware/moderator
 * @function
 * @param {Object} req - Express request object. Expected to contain `decoded.permissions` from JWT.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to pass control to the next middleware or route.
 * 
 * @returns {Object} 403 response if user is not a moderator or admin.
 */

module.exports = function (req, res, next) {
    const { permissions } = req.decoded;

    // Allow admins to pass through
    if (permissions?.admin) return next();

    // Check if user is a moderator
    if (!permissions?.moderator) {
        return res.status(403).json({ msg: "Access denied: not a moderator" });
    }
    next();
};
