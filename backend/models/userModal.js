const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: "http://img.freepik.com/free-icon/user_318-159711.jpg",
    },
    subscribers: {
      type: [String],
    },
    subscribedUsers: {
      type: [String],
    },
    otp: {
      value: {
        type: Number,
      },
      expiryTime: {
        type: Date,
      },
    },
    history: [
      {
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
      },
    ],
    watchLater: {
      type: [String],
    },
  },
  { timestamps: true }
);

const DevTubeUser = mongoose.model("DevTubeUser", UserSchema);

module.exports = DevTubeUser;
