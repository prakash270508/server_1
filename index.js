const express = require("express");
const app = express();
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoute.js");
const authRoute = require("./routes/auth.js");
const orderRoute = require("./routes/orderRoute.js");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./utils/db.js");
dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());

app.use(cors());

//Routes
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/order", orderRoute);

//
app.get('/', (req, res)=>{
  res.send("Woking fine")
})

//Error handlling
app.use((error, req, res, next) => {
  const errorMessage = error.message || "Something went wrong";
  const errorStatus = error.status || 500;

  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`.gray.bold);
});
