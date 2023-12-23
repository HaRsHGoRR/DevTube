const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  videos: [
    {
      videoId: {
        type: String,
        required: true,
      },
      timeAdded: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const DevTubeUserPlaylist = mongoose.model(
  "DevTubeUserPlaylist",
  PlaylistSchema
);

module.exports = DevTubeUserPlaylist;
