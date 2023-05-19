const express = require("express");
const app = express();
const userRoute = require("./routes/userRoute.js");
const authRoute = require("./routes/auth.js");
const orderRoute = require("./routes/orderRoute.js");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./utils/db");
connectDB();

let databaseMessage = "";
connectDB().then((data) => {
  databaseMessage = data;
  console.log(data);
});

app.use(express.json());

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

app.listen(4000, () => {
  console.log("App is running on port 4000");
});
