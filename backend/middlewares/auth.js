const User = require("../models/user");

const jwt = require("jsonwebtoken");
const user = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

//check if user is authenticated
exports.isAuthonticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);
  if (!token) {
    return next(
      new ErrorHandler("Token DOMTokenList't exist.login first", 401)
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
});

//handling user roles

exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to acess this resourse`,
          401
        )
      );
      next();
    }
  };
};
