const express = require("express");
const app = express();
const userRoute = require("./routes/userRoute.js");
const authRoute = require("./routes/auth.js");
const orderRoute = require("./routes/orderRoute.js");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./utils/db");
const cors = require('cors')
connectDB();

let databaseMessage = "";
connectDB().then((data) => {
  databaseMessage = data;
  console.log(data);
});

app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  res.send("All working");
});

app.get("/me", (req, res) => {
  res.json({ message: "All working" });
});

app.get("/db", (req, res) => {
  res.json({ message: databaseMessage });
});

app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/order", orderRoute);

app.use((error, req, res, next) => {
    const errorMessage = error.message || "Something went wrong";
    const errorStatus = error.status || 500;
  
    res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
    });
  });

app.listen(4000, () => {
  console.log("App is running on port 4000");
});
