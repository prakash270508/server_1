const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { createError } = require("../utils/error.js");
const jwt = require("jsonwebtoken");

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

    res
      .status(201)
      .json({ message: "Registration successfull", newUser });
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
