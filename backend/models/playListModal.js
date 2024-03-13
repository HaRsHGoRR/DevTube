const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
    default: "",
  },
  userId: {
    type: String,
    required: true,
  },
  videos: [
    {
      videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DevTubeVideo", // Reference to DevTubeVideo model
        required: true,
      },
      timeAdded: {
        type: Date,
        default: Date.now,
      },
    },
  ],
},  { timestamps: true });

const DevTubeUserPlaylist = mongoose.model(
  "DevTubeUserPlaylist",
  PlaylistSchema
);

module.exports = DevTubeUserPlaylist;
