const dotenv = require("dotenv");
const colors = require("colors");
const express = require("express");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const { sendEmail } = require("./config/mailers");
const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");
const commentRoutes = require("./routes/commentRoutes");

// creating server
const app = express();

// dot env file configuration
dotenv.config();

// connect to database function
connectDB();

// accepting data in JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from server.");
});

// userRoutes
app.use("/user", userRoutes);

// videoRoutes
app.use("/video", videoRoutes);

// commentRoutes
app.use("/comment", commentRoutes);
// handling errors like not found and other erros
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server is Started.".bgGreen);
});
