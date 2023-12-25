require("dotenv").config();
const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `server/config/db.js:CONNECTED TO DATABASE SUCCESSFULLY`.bgGreen
    );
  } catch (error) {
    console.log(error);
    console.log(`server/config/db.js:FAILED CONNECT TO DATABASE`.bgRed);
    process.exit();
  }
};

module.exports = connectDB;
