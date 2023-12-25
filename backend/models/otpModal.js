const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiredIn: {
    type: Date,
    required: true,
  },
});

otpSchema.methods.mathchOtp = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otp);
};

otpSchema.pre("save", async function (next) {
  this.otp = await bcrypt.hash(this.otp, 10);
  next();
});
const DevTubeOtp = mongoose.model("DevTubeOtp", otpSchema);

module.exports = DevTubeOtp;
