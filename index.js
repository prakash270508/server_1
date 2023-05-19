const express = require("express");
const app = express();
const { connectDB } = require("./utils/db");
connectDB();

let databaseMessage = connectDB();

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

app.listen(4000, () => {
  console.log("App is running on port 4000");
});
