/**
 * @file admin.js
 * @description Middleware to authorize admin-level access. It checks if the decoded JWT token
 * contains the `admin` permission. If not, the request is rejected with a 401 Unauthorized status.
 * 
 * @module middleware/admin
 * @function
 * @param {Object} req - Express request object, expected to contain `decoded.permissions` from the JWT.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 * 
 * @returns {Object} 401 response if the user does not have admin permissions.
 */

module.exports = function (req, res, next) {
    const permissions = req.decoded.permissions;
    if (!permissions.admin)
        return res.status(401).json({ msg: "Not authorized" });
    next();
};
