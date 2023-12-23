const mongoose = require("mongoose");

const DevTubeVideoDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
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
});

const DevTubeVideoData = mongoose.model(
  "DevTubeVideoDataSchema",
  DevTubeVideoDataSchema
);

module.exports = DevTubeVideoData;
