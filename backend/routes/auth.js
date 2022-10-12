const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logOutUser,
  forgotPassword,
} = require("../controllers/authController");

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);
router.route("/logout").post(logOutUser);

module.exports = router;
