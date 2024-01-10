const mongoose = require("mongoose");

const DevTubeVideoDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DevTubeUser", // Reference to DevTubeVideo model

      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DevTubeVideo", // Reference to DevTubeVideo model
      required: true,
    },
    timeCompleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const DevTubeVideoData = mongoose.model(
  "DevTubeVideoData",
  DevTubeVideoDataSchema
);

module.exports = DevTubeVideoData;
