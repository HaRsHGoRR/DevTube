const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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

    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DevTubeVideoData",
      },
    ],

    watchLater: {
      type: [String],
    },
  },
  { timestamps: true }
);

UserSchema.methods.mathchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const DevTubeUser = mongoose.model("DevTubeUser", UserSchema);

module.exports = DevTubeUser;
