require("dotenv").config();
const DevTubeUser = require("../models/userModal");
const OTP = require("../models/otpModal");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");
const { mailer } = require("../config/mailers");
const DevTubeVideo = require("../models/videoModal");
const jwt = require("jsonwebtoken");
const DevTubeVideoData = require("../models/devTubeVideoData");
const DevTubeComment = require("../models/commentModal");
const DevTubeUserPlaylist = require("../models/playListModal");
const DevTubeViews = require("../models/viewModal");

// user crud apis
const authenticateUser = asyncHandler(async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    let data = await DevTubeUser.findById(decoded.id)
      .select("-password")
      .lean();
    if (data) {
      res.status(200).json({ ...data, token: generateToken(decoded.id) });
    } else {
      throw new Error("user not found");
    }
  } catch (error) {
    res.status(400).json({ status: "FAIL" });
  }
});

const googleAuth = asyncHandler(async (req, res) => {
  const { name, email, img } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error("Please enter all the fields.");
  }

  const userExistsEMail = await DevTubeUser.findOne({ email });

  if (userExistsEMail) {
    let user = userExistsEMail;

    if (userExistsEMail.google == false) {
      userExistsEMail.google = true;
      userExistsEMail.save();
    }

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
      google: user.google,
    });
  } else {
    const user = await DevTubeUser.create({
      name,
      email,
      google: true,
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
        google: user.google,
      });
    } else {
      res.status(400);
      throw new Error("Sorry, failed to create user.");
    }
  }
});

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
      // history: user.history,
      // watchLater: user.watchLater,
      token: generateToken(user._id),
      google: user.google,
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
  if (user && user.google) {
    res.status(400);
    throw new Error("Please login via Google.");
  }

  if (user && (await user.mathchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      img: user.img,
      subscribers: user.subscribers,
      subscribedUsers: user.subscribedUsers,
      // history: user.history,
      // watchLater: user.watchLater,
      token: generateToken(user._id),
      google: user.google,
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
    let user = updatedUser;
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      img: user.img,
      subscribers: user.subscribers,
      subscribedUsers: user.subscribedUsers,
      // history: user.history,
      // watchLater: user.watchLater,
      token: generateToken(user._id),
      google: user.google,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Can not Update User.");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    // remove videos from playlist
    await DevTubeVideo.find({ userId: userId })
      .then(async (videos) => {
        const videoIdsToRemove = videos.map((video) => video._id); // Get array of video IDs

        // Update all playlists to remove video references created by the userId
        await DevTubeUserPlaylist.updateMany(
          { "videos.videoId": { $in: videoIdsToRemove } }, // Match playlists with videos created by the userId
          { $pull: { videos: { videoId: { $in: videoIdsToRemove } } } }, // Pull/remove videos with the given videoIds
          { multi: true } // Update multiple documents
        );

        // update all watchLater to remove video references credted by userId
        await DevTubeUser.updateMany(
          {
            watchLater: { $in: videoIdsToRemove },
          },
          { $pull: { watchLater: { $in: videoIdsToRemove } } },
          { multi: true }
        );

        // remove history data from videoData
        let historyData = await DevTubeVideoData.find({
          videoId: { $in: videoIdsToRemove },
        });
        historyData = historyData.map((data) => String(data._id));

        await DevTubeUser.updateMany(
          { history: { $in: historyData } },
          { $pull: { history: { $in: historyData } } },
          { multi: true }
        );

        await DevTubeUserPlaylist.deleteMany({ userId });

        await DevTubeVideoData.deleteMany(
          {
            videoId: { $in: videoIdsToRemove },
          },
          { multi: true }
        );

        await DevTubeUser.updateMany(
          { $or: [{ subscribers: userId }, { subscribedUsers: userId }] },
          { $pull: { subscribers: userId, subscribedUsers: userId } }
        );

        await DevTubeComment.deleteMany({
          $or: [{ userId }, { videoId: { $in: videoIdsToRemove } }],
        });
        await DevTubeVideo.deleteMany({ userId });
        await DevTubeUser.findByIdAndDelete(userId);
      })

      .catch((error) => {
        throw Error(error);
      });

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
    const user = await DevTubeUser.findById(req.params.id).select(
      "name img subscribers"
    );

    // const videos = await DevTubeVideo.find({ userId: req.params.id });
    const videos = await DevTubeVideo.find({ userId: req.params.id }).sort({
      updatedAt: -1,
    });

    res.status(200).json({ user: user._doc, videos });
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

// sub and unsub

const subscribe = asyncHandler(async (req, res) => {
  try {
    // Check if the user is already subscribed
    const isAlreadySubscribed = await DevTubeUser.exists({
      _id: req.user._id,
      subscribedUsers: req.params.id,
    });

    if (isAlreadySubscribed) {
      throw new Error("Already Subscribed");

      return;
    }

    // Update the subscriber's subscribedUsers array
    const updateSubcriber = await DevTubeUser.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { subscribedUsers: req.params.id },
      },
      { new: true }
    );

    // Update the creator's subscribers array
    const updateCreator = await DevTubeUser.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { subscribers: req.user._id },
      },
      {
        new: true,
      }
    );

    res.status(200).json({ status: "Subscription Successful" });
  } catch (error) {
    throw error;
  }
});

const unsubscribe = asyncHandler(async (req, res) => {
  try {
    // Check if the user is subscribed before attempting to unsubscribe
    const isSubscribed = await DevTubeUser.exists({
      _id: req.user._id,
      subscribedUsers: req.params.id,
    });

    if (!isSubscribed) {
      throw new Error("Not Subscribed");
      return;
    }

    // Update the subscriber's subscribedUsers array
    const updateSubscriber = await DevTubeUser.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { subscribedUsers: req.params.id },
      },
      { new: true }
    );

    // Update the creator's subscribers array
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
    res.status(400).json({ error: "Can not Unsubscribe from User." });
  }
});

const manageSubscription = asyncHandler(async (req, res) => {
  try {
    const isSubscribed = await DevTubeUser.exists({
      _id: req.user._id,
      subscribedUsers: req.params.id,
    });

    if (isSubscribed) {
      // User is already subscribed, perform unsubscription
      await DevTubeUser.findByIdAndUpdate(
        req.user._id,
        { $pull: { subscribedUsers: req.params.id } },
        { new: true }
      );

      const sub = await DevTubeUser.findByIdAndUpdate(
        req.params.id,
        { $pull: { subscribers: req.user._id } },
        { new: true }
      );

      res.status(200).json({
        status: "Unsubscription Successful",
        subscribers: sub.subscribers.length,
      });
    } else {
      // User is not subscribed, perform subscription
      await DevTubeUser.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { subscribedUsers: req.params.id } },
        { new: true }
      );

      const sub = await DevTubeUser.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { subscribers: req.user._id } },
        { new: true }
      );

      res.status(200).json({
        status: "Subscription Successful",
        subscribers: sub.subscribers.length,
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Unable to manage subscription." });
  }
});

// Usage
// To manage subscription (subscribe if not subscribed, unsubscribe if subscribed): manageSubscription(req, res, { params: { id: 'someUserId' } });

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
          populate: {
          path: "userId",
          model:"DevTubeUser",
          select: "name ",
        },
      });

      if (user) {
        res.status(200).json(user.watchLater);
      }
    }
  } catch (error) {
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
    ).populate({ path: "watchLater",  populate: {
          path: "userId",
          model:"DevTubeUser",
          select: "name ",
        }, });

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
      populate: {
          path: "userId",
          model:"DevTubeUser",
          select: "name ",
        },
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
// const fetchUserHistory = asyncHandler(async (req, res) => {
//   const userId = req.user._id;
//   try {
//     const userHistory = await DevTubeUser.findById(userId)
//       .populate({
//         path: "history",
//         model: "DevTubeVideoData", // Assuming the name of the model is 'DevTubeVideoData'
//         options: { sort: { updatedAt: -1 } }, // Sort by 'updatedAt' in descending order
//         populate: {
//           path: "videoId",
//           model: "DevTubeVideo", // Assuming the name of the model is 'DevTubeVideo'
//         },
//       })
//       .select("-password")

//     res.status(200).json(userHistory.history);
//   } catch (error) {
//     res.status(500);
//     throw new Error("Can not load History.");
//   }
// });

const fetchUserHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    const userHistory = await DevTubeUser.findById(userId)
      .populate({
        path: "history",
        model: "DevTubeVideoData",
        options: { sort: { updatedAt: -1 } },
        populate: {
          path: "videoId",
          model: "DevTubeVideo",

          populate: {
            path: "userId",
            model: "DevTubeUser",
            select: "name", // Select only the 'name' field from the user document
          },
        },
      })
      .select("-password"); // Exclude the 'password' field

    // Extracting user's name from populated field and including it in each history item

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

// analysis

const analysis = asyncHandler(async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user._id;

    const findVideo = await DevTubeVideo.findById(videoId);
    if (!findVideo) {
      throw new Error("Video not found.");
    }
    if (findVideo.userId != userId) {
      throw new Error("Not authorized to analyze.");
    }

    const totalTime = findVideo.length;

    const findUser = await DevTubeVideoData.find({ videoId }).populate(
      "userId"
    );

    const percentageDetails = [];

    findUser.forEach((videoData) => {
      const percentageWatched = (videoData.timeCompleted / totalTime) * 100;

      // Include user details (username) and their percentage in the response
      percentageDetails.push({
        username: videoData.userId.name,
        userImg:videoData.userId.img,
        userId:videoData.userId?._id,
        percentageWatched: percentageWatched.toFixed(2), // Adjust decimal places as needed
      });
    });

    res.status(200).json(percentageDetails);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

module.exports = {
  manageSubscription,
  googleAuth,
  analysis,
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

  deleteWatchLater,
  fetchWatchLater,
  updateWatchLater,
  addWatchLater,
  authenticateUser,
};
