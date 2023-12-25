require("dotenv").config();
const DevTubeUser = require("../models/userModal");
const OTP = require("../models/otpModal");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");
const { mailer } = require("../config/mailers");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, img } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields.");
  }

  const userExistsEMail = await DevTubeUser.findOne({ email });

  if (userExistsEMail) {
    res.status(400);
    throw new Error("User already exists.");
  }

  const user = await DevTubeUser.create({
    name,
    email,
    password,
    img,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      img: user.img,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Sorry, failed to create user.");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(404);
    throw new Error("Please enter all the fields.");
  }
  let user;
  if (email) {
    user = await DevTubeUser.findOne({ email });
  }

  if (user && (await user.mathchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      img: user.img,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("Invalid Details");
  }
});

const sendEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(404);
    throw new Error("Please enter email and code");
  }

  const findId = await DevTubeUser.findOne({ email });

  if (findId && code == -1) {
    res.status(404);
    throw new Error("User already exist");
  }

  if (!findId && code == 1) {
    res.status(404);
    throw new Error("User does not exist");
  }

  const data = await mailer(email);

  if (data.status == "success") {
    const createdOtp = await OTP.create({
      email: email,
      otp: data.otp,
      createdAt: Date.now(),
      expiredIn: Date.now() + 300000,
    });

    if (createdOtp) {
      res.status(201).json({
        email: email,
        status: "EMAIL SENT",
      });
    } else {
      res.status(400);
      throw new Error("Can not send OTP.");
    }
  } else {
    res.status(400);
    throw new Error("Can not send mail.");
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(404);
    throw new Error("Please enter all details");
  }

  const enteredOtp = otp;

  const usersOtp = await OTP.find({ email }).sort({ createdAt: -1 });
  let expiryTime;
  if (usersOtp.length <= 0) {
    res.status(404);
    throw new Error("Can not verify email.");
  } else {
    expiryTime = new Date(usersOtp[0].expiredIn).getTime();
    if ((await usersOtp[0].mathchOtp(enteredOtp)) && expiryTime >= Date.now()) {
      await OTP.deleteMany({ email: email });
      res.json({
        staus: "VERIFEID",
      });
    } else {
      res.status(404);
      throw new Error("Invalid OTP Or OTP Expired");
    }
  }
});

const forgotpassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all details");
  }

  const user = await DevTubeUser.findOne({ email });

  if (user) {
    user.password = password;
    await user.save();
    res.status(201).json({
      status: "PASSWORD SET SUCCESSFULLY",
    });
  } else {
    res.status(400);
    throw new Error("Can not change password");
  }
});

const resetpassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const email = req.user.email;

  if (!email || !oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Please enter all details");
  }

  const user = await DevTubeUser.findOne({ email });

  if (user && (await user.mathchPassword(oldPassword))) {
    user.password = newPassword;
    user.save();
    res.status(201).json({
      status: "PASSWORD SET SUCCESSFULLY",
    });
  } else {
    res.status(400);
    throw new Error("Invalid details");
  }
});



module.exports = {
  registerUser,
  loginUser,
  sendEmail,
  verifyEmail,
  forgotpassword,
  resetpassword,
};
