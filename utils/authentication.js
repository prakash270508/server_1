const jwt = require("jsonwebtoken");
const { createError } = require("./error");
const User = require("../models/userModel");

// const verifyToken = async (req, res, next) => {

//   // console.log(req.headers.authorization)

//   const token = req.cookies.user_Token;

//   if (!token) {
//     return next(createError(403, "Please login"));
//   }

//   let data = jwt.verify(token, process.env.JWT_SECRETE);

//   req.user = await User.findById(data._id);

//   next();
// };

const verifyToken = async (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {
    return next(createError(403, "Please login"));
  }

  let data = jwt.verify(token, process.env.JWT_SECRETE);

  req.user = await User.findById(data._id);

  next();
};

const verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return next(createError(403, "You are not admin"));
  }
};

const verifySelf = (req, res, next)=>{

  if (  req.user._id == req.params.id || req.user.isAdmin) {
    next();
  } else {
    return next(createError(403, "It's not your Acccount"));
  }

}

module.exports = {
  verifyToken,
  verifyAdmin,
  verifySelf
};
