const express = require("express");
const {
  register,
  login,
  logout,
  check,
  me
} = require("../controller/userController");

const { verifyToken , verifyAdmin} = require("../utils/authentication");

const router = express.Router();

//Register
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/me").get(verifyToken, me);
router.route("/check").get(verifyToken,verifyAdmin, check);

module.exports = router;
