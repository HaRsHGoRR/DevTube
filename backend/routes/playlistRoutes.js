const express = require("express");
const {
  createPlaylist,
  fetchPlaylists,
  deletePlaylist,
  updatePlaylist,
  addVideoToPlaylist,
  removeVideoToPlaylist,
} = require("../controllers/playListController");
const { protect } = require("../middlewares/authorization");

const router = express.Router();

// crud on playlist

router.post("/", protect, createPlaylist);
router.get("/", protect, fetchPlaylists);
router.delete("/:id", protect, deletePlaylist);
router.put("/:id", protect, updatePlaylist);

// add and remove from playlist

router.put("/add/:id", protect, addVideoToPlaylist);
router.put("/remove/:id", protect, removeVideoToPlaylist);

module.exports = router;
