const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    useId: {
      type: String,
      required: true,
    },
    desc: {
      required: true,
      type: String,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: [String],
      default: [],
    },
    disLikes: {
      type: [String],
      default: [],
    },
    length: {
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

const DevTubeVideo = mongoose.model("DevTubeVideo", VideoSchema);

module.exports = DevTubeVideo;
