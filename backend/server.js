const dotenv = require("dotenv");
const colors = require("colors");

const express = require("express");
const connectDB = require("./config/db");

const app = express();
dotenv.config();

connectDB();


app.listen(process.env.PORT, () => {
  console.log("Server is Started.".bgGreen);
});
