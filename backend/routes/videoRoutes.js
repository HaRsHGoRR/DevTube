const express = require("express");
const { protect } = require("../middlewares/authorization");
const {
  addVideo,
  updateVideo,
  deleteVideo,
  findVideo,
  addView,
  trend,
  random,
  sub,
  tag,
  search,
  fetchVideos,
  addTime,
  like,
  dislike,
} = require("../controllers/videoControllers");

const router = express.Router();

// crud on video
router.post("/", protect, addVideo);
router.put("/update/:id", protect, updateVideo);
router.delete("/delete/:id", protect, deleteVideo);
router.get("/", protect, fetchVideos);
router.get("/find/:id", protect, findVideo);

// adding view
router.put("/view/:id", protect, addView);

// geting videos
router.get("/trend", protect, trend);
router.get("/random", protect, random);
router.get("/sub", protect, sub);
router.get("/tags", protect, tag);
router.get("/search", protect, search);

// updating time
router.post("/time/:id", protect, addTime);

// like and dislike

router.put("/like/:id", protect, like);
router.put("/dislike/:id", protect, dislike);

module.exports = router;
