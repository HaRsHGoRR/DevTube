const mongoose = require("mongoose");

const CommmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DevTubeUser",
      required: true,
    },

    videoId: {
      type: String,

      required: true,
    },

    desc: {
      type: String,

      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DevTubeComment = mongoose.model("DevTubeComment", CommmentSchema);

module.exports = DevTubeComment;
