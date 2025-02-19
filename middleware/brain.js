const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");

module.exports = function (req, res, next) {
  //Get token from header
  const user = req.user;
  if (User.role !== "brain")
    return res.status(401).json({ msg: "Not authorized" });
};
