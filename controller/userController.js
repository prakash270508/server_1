const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { createError } = require("../utils/error.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");

//Register
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successfull", newUser });
  } catch (error) {
    if (error.keyValue.username) {
      next(createError(403, "Username Already exist"));
    } else if (error.keyValue.email) {
      next(createError(403, "Email Already exist"));
    }
  }
};

//Login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return next(createError(403, "User not found"));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return next(createError(403, "Invlaid credentials"));
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETE);

    res.cookie("user_Token", token, {
      expires: new Date(Date.now() + 2589200000),
      httpOnly: true,
    });
    res.status(201).json({ message: "Logged in", user, token });
  } catch (error) {
    next(error);
  }
};

//Logout
exports.logout = async (req, res, next) => {
  try {
    res
      .cookie("user_Token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .status(201)
      .json({ message: "logged out" });
  } catch (error) {
    next(error);
  }
};

//check
exports.check = async (req, res, next) => {
  try {
    res.json({ message: "All woking" });
  } catch (error) {
    next(error);
  }
};

//me
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    next(error.message);
  }
};

//All users
exports.allUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

//user by id
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(createError(403, "User not found"));

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//Update user
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!user) return next(createError(403, "User not found"));

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

//forgetPassword
exports.forgetPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  try {
    if (!user) {
      return next(createError(400, "User not found"));
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/auth/reset-password/${resetToken}`;

    const message = `${user.username} Your password reset link is \n\n ${resetLink} \n\n It is valid till 15mins Please ignore if you not requested for this.`;

    await sendEmail({
      email: user.email,
      subject: `Password Recovery`,
      message,
    });

    res.status(201).json({
      success: true,
      message: `Email send to ${user.email} successfully.`,
      user,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    next(error);
  }
};

//ResetPassword

exports.resetPassword = async (req, res, next) => {
  const { password, repeatPassword } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(createError(400, "Invalid or expired reset token"));
    }

    if (password != repeatPassword) {
      return next(createError(400, "Password not match"));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    user.password = hashPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      user: user,
    });
  } catch (error) {
    next(error);
  }
};
