const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message + "🤦‍♂️" || "interbal Server Error 🤦‍♂️";

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };

    error.message = err.message;

    //handlinh mongoose object id errror
    if (err.message == "CastError") {
      const message = `Resource not found.Invalid:${err.path} 🤦‍♂️`;
      error = new ErrorHandler(message, 400);
    }

    //handle mongoose validation error
    if (err.name == "ValidationError") {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new ErrorHandler(message, 400);
    }
    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error 🤦‍♂️",
    });
  }
};
