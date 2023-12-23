const dotenv = require("dotenv");
const colors = require("colors");
const express = require("express");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const { sendEmail } = require("./config/mailers");

// creating server
const app = express();

// dot env file configuration
dotenv.config();

// connect to database function
connectDB();

// accepting data in JSON
app.use(express.json());

// handling errors like not found and other erros
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server is Started.".bgGreen);
});
