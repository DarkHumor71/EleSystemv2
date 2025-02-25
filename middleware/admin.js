module.exports = function (req, res, next) {
  const permissions = req.decoded.permissions;
  if (!permissions.admin)
    return res.status(401).json({ msg: "Not authorized" });
  next();
};
