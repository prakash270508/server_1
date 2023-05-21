const express = require("express");
const {
  register,
  login,
  logout,
  check,
  me,
  forgetPassword,
  resetPassword
} = require("../controller/userController");

const { verifyToken , verifyAdmin} = require("../utils/authentication");

const router = express.Router();

//Register
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/me").get(verifyToken, me);
router.route("/check").get(verifyToken,verifyAdmin, check);
router.route('/forget-password').post(forgetPassword)
router.route('/reset-password/:token').post(resetPassword)

module.exports = router;
