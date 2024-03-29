const dotenv = require("dotenv");
const colors = require("colors");
const express = require("express");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const { sendEmail } = require("./config/mailers");
const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");
const commentRoutes = require("./routes/commentRoutes");
const playlistRoutes=require("./routes/playlistRoutes")
const cors=require("cors")

// creating server
const app = express();

// dot env file configuration
dotenv.config();

// connect to database function
connectDB();

// accepting data in JSON
app.use(express.json());

// allowing cors origin
const corsAllow={
  origin:"https://devtube-zeta.vercel.app/",
  methods:"PUT,GET,UPDATE,POST,PATCH,DELETE,HEAD",
  credentials:true
}
app.use(cors(corsAllow));

app.get("/", (req, res) => {
  res.send("hello from server.");
});

// userRoutes
app.use("/user", userRoutes);

// videoRoutes
app.use("/video", videoRoutes);

// commentRoutes
app.use("/comment", commentRoutes);

// playlistRoutes
app.use("/playlist",playlistRoutes);

// handling errors like not found and other erros
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server is Started.".bgGreen);
});
