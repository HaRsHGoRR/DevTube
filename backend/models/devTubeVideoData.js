const mongoose = require("mongoose");

const DevTubeVideoDataSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DevTubeVideo", // Reference to DevTubeVideo model
      required: true,
    },
    timeCompleted: {
      hours: {
        type: Number,
        default: 0,
      },
      minutes: {
        type: Number,
        default: 0,
      },
      seconds: {
        type: Number,
        default: 0,
      },
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
