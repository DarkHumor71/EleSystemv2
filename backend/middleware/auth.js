/**
 * @file auth.js
 * @description Middleware to authenticate requests using a JWT token. It extracts the token from the 
 * `x-auth-token` header, verifies it, and attaches the decoded payload to `req.decoded`.
 * If the token is missing or invalid, it returns a 401 Unauthorized response.
 * 
 * @module middleware/auth
 * @function
 * @param {Object} req - Express request object, expects JWT token in `x-auth-token` header.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 * 
 * @returns {Object} 401 response if no token or if token verification fails.
 */

const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header("x-auth-token");

    //Check if no token
    if (!token)
        return res.status(401).json({ msg: "No token, authorization denied" });

    //break token into parts
    //decode token
    try {
        req.decoded = jwt.verify(token, config.get("jwtSecret"));
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
