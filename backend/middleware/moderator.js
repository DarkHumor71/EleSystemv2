module.exports = function (req, res, next) {
    const {permissions} = req.decoded;

    // Allow admins to pass through
    if (permissions?.admin) return next();

    // Check if user is a moderator
    if (!permissions?.moderator) {
        return res.status(403).json({msg: "Access denied: not a moderator"});
    }
    next();
};
