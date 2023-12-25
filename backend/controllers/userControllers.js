require("dotenv").config();
const DevTubeUser = require("../models/userModal");
const OTP = require("../models/otpModal");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");
const { mailer } = require("../config/mailers");

// user crud apis

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
      subscribers: user.subscribers,
      subscribedUsers: user.subscribedUsers,
      history: user.history,
      watchLater: user.watchLater,
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
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      img: user.img,
      subscribers: user.subscribers,
      subscribedUsers: user.subscribedUsers,
      history: user.history,
      watchLater: user.watchLater,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Details");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const data = req.body;

  try {
    const updatedUser = await DevTubeUser.findByIdAndUpdate(
      req.user._id,
      {
        $set: data,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400);
    throw new Error("Can not Update User.");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    await DevTubeUser.findByIdAndDelete(req.user._id);

    res.status(200).json({
      status: "DELETED",
    });
  } catch (err) {
    res.status(400);
    throw new Error("Can not Delete User.");
  }
});

const findUser = asyncHandler(async (req, res) => {
  try {
    const user = await DevTubeUser.findById(req.params.id).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(400);
    throw new Error("Can not Find User.");
  }
});

// email send verify and reset forgot password

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

// like dislike sub and unsub

const subscribe = asyncHandler(async (req, res) => {
  try {
    const updateSubcriber = await DevTubeUser.findByIdAndUpdate(
      req.user._id,
      {
        $push: { subscribedUsers: req.params.id },
      },
      { new: true }
    );

    const updateCreator = await DevTubeUser.findByIdAndUpdate(
      req.params.id,
      {
        $push: { subscribers: req.user._id },
      },
      {
        new: true,
      }
    );

    res.status(200).json({ status: "Subscription Successful" });
  } catch (error) {
    res.status(400);
    throw new Error("Can not Subscribe to User.");
  }
});

const unsubscribe = asyncHandler(async (req, res) => {
  try {
    const updateSubcriber = await DevTubeUser.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { subscribedUsers: req.params.id },
      },
      { new: true }
    );

    const updateCreator = await DevTubeUser.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { subscribers: req.user._id },
      },
      {
        new: true,
      }
    );

    res.status(200).json({ status: "Unsubscription Successful" });
  } catch (error) {
    res.status(400);
    throw new Error("Can not Unsubscribe to User.");
  }
});

const like = asyncHandler(async (req, res) => {
  try {
  } catch (error) {}
});

const dislike = asyncHandler(async (req, res) => {
  try {
  } catch (error) {}
});

// watch later apis

const addWatchLater = asyncHandler(async (req, res) => {
  try {
  } catch (error) {}
});

const updateWatchLater = asyncHandler(async (req, res) => {
  try {
  } catch (error) {}
});

const fetchWatchLater = asyncHandler(async (req, res) => {
  try {
  } catch (error) {}
});

const deleteWatchLater = asyncHandler(async (req, res) => {
  try {
  } catch (error) {}
});




module.exports = {
  registerUser,
  loginUser,
  sendEmail,
  verifyEmail,
  forgotpassword,
  resetpassword,
  updateUser,
  deleteUser,
  findUser,
  subscribe,
  unsubscribe,
  like,
  dislike,
  deleteWatchLater,
  fetchWatchLater,
  updateWatchLater,
  addWatchLater,
};
