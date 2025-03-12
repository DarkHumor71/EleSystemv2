module.exports = function (req, res, next) {
  //Get token from header
  const permissions = req.decoded.permissions;
  if (!permissions.moderator)
    return res.status(401).json({ msg: "Not authorized" });
  next();
};
