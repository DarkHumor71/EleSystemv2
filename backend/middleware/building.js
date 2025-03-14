module.exports = function (req, res, next) {
  const building = req.building;
  if (building === null) return res.status(401).json({ msg: "Not authorized" });
  next();
};
