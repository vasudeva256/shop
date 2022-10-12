const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncErrors");
const { response } = require("../app");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

//register a user    =>/api/v1/register

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avator: {
      public_id: "ookkoko",
      url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fb%2Fb0%2FF_cursiva.gif&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FF&tbnid=XufNeUrYrcJ1hM&vet=12ahUKEwi7uLnH_K36AhU0T3wKHT-6AFcQMygBegUIARCSAQ..i&docid=FtcMG32jpIXC6M&w=512&h=512&q=f&ved=2ahUKEwi7uLnH_K36AhU0T3wKHT-6AFcQMygBegUIARCSAQ",
    },
  });
  const token = user.getJwtTokwn();
  sendToken(user, 200, res);
});

// ********************************

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  if (!email || !password) {
    return next(new ErrorHandler("please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("invalid email or password", 401));
  }
  //checking the password
  const isPasswordMatched = await user.comparepassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid password", 401));
  }
  const token = user.getJwtTokwn();
  sendToken(user, 200, res);
});

//forgot password

// ********************************
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("user doesnt exist", 401));
  }
  //rest token
  const resetToken = user.getResetPasswordToken();

  //create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset Token is as follow:\n ${resetUrl}.\nIf you have not this email ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIT password recovery",
      message: `email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});
//
// ********************************

//logout user
exports.logOutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("Token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Loged Out" });
});
