const User = require("../models/user");
const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");

exports.isLoggedIn = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new CustomError("Login before accessing this page!", 400);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  console.log(req.user._id);
  next();
});

exports.customRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new CustomError("You are not allowed for this resouce", 403));
    }
    next();
  };
};
