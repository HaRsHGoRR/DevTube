require("dotenv").config();
const DevTubeUser = require("../models/userModal");
const OTP = require("../models/otpModal");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");
const { mailer } = require("../config/mailers");
const DevTubeVideo = require("../models/videoModal");
const jwt = require("jsonwebtoken");


// user crud apis
const authenticateUser=asyncHandler(async(req,res)=>{
    const {token}=req.body
  try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      console.log(decoded);
    const data = await DevTubeUser.findById(decoded.id).select("-password");

    if(data){
    res.status(200).json({ status: "SUCCESS" });

    }


  } catch (error) {
     res.status(400).json({ status: "FAIL" });
  }
})

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
    const videoId = req.params.id;
    const userId = req.user._id;

    const video = await DevTubeVideo.findById(videoId);

    if (!video) {
      res.status(404);
      throw new Error("Can not find Video.");
    }

    const findVideo = await DevTubeUser.findById(userId).populate({
      path: "watchLater",
    });

     const isVideoInWatchLater = findVideo.watchLater.some((watchLaterVideo) =>
       watchLaterVideo._id.equals(videoId)
     );


    if (isVideoInWatchLater) {
      res.status(200).json(findVideo.watchLater);
    } else {
      const user = await DevTubeUser.findByIdAndUpdate(
        userId,
        {
          $push: {
            watchLater: {
              $each: [videoId],
              $position: 0,
            },
          },
        },
        { new: true }
      ).populate({
        path: "watchLater",
      });

      if (user) {
        res.status(200).json(user.watchLater);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Can not add video to watch later.");
  }
});

const updateWatchLater = asyncHandler(async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user._id;

    const video = await DevTubeVideo.findById(videoId);

    if (!video) {
      res.status(404);
      throw new Error("Can not find Video.");
    }

    const user = await DevTubeUser.findByIdAndUpdate(
      userId,
      {
        $pull: { watchLater: videoId },
      },
      { new: true }
    ).populate({ path: "watchLater" });

    if (user) {
      res.status(200).json(user.watchLater);
    }
  } catch (error) {
    res.status(500);
    throw new Error("Can not remove video from watch later.");
  }
});

const fetchWatchLater = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const wacthLaterVideos = await DevTubeUser.findById(userId).populate({
      path: "watchLater",
    });

    res.status(200).json(wacthLaterVideos.watchLater);
  } catch (error) {
    res.status(500);
    throw new Error("Can not load watch later.");
  }
});

const deleteWatchLater = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await DevTubeUser.findByIdAndUpdate(
      userId,
      {
        $set: { watchLater: [] },
      },
      { new: true }
    );
    res.status(200).json(user.watchLater);
  } catch (error) {
    res.status(500);
    throw new Error("Can not delete watch later.");
  }
});

// history apis
const fetchUserHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    const userHistory = await DevTubeUser.findById(userId)
      .populate({
        path: "history",
        model: "DevTubeVideoData", // Assuming the name of the model is 'DevTubeVideoData'
        options: { sort: { updatedAt: -1 } }, // Sort by 'updatedAt' in descending order
        populate: {
          path: "videoId",
          model: "DevTubeVideo", // Assuming the name of the model is 'DevTubeVideo'
        },
      })
      .select("-password"); // Exclude the 'password' field
    res.status(200).json(userHistory.history);
  } catch (error) {
    res.status(500);
    throw new Error("Can not load History.");
  }
});
const deleteUserHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    const deleteHistory = await DevTubeUser.updateOne(
      { _id: userId },
      { $set: { history: [] } }
    );
    if (deleteHistory) {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500);
    throw new Error("Can not delete History.");
  }
});

module.exports = {
  deleteUserHistory,
  fetchUserHistory,
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
  authenticateUser,
};
