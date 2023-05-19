const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://prakash0508:21072ppp@cluster0.cai9w2w.mongodb.net/e-com');
    console.log("Connected to database");
    return "All working good from database"

  } catch (error) {
    console.log("Not Connected to database");
  }
};
