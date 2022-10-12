const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter name"],
    maxlength: [30, "your name can't exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "please enter email"],
    unique: true,
    validator: [validator.isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter password"],
    minLength: [6, "your password must be at least 6 characters long"],
    select: false,
  },
  avator: {
    public_id: {
      type: String,
      required: true,
    },
    url: { type: String, required: true },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//Encrypt the password before saving

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//compare the password
userSchema.methods.comparepassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//return JWT tokem
userSchema.methods.getJwtTokwn = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
  expiresIn: process.env.JWT_SECRET_TIME;
};

//generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hash and set to reset password token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() * 30 * 60 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
