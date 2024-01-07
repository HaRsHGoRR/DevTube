const DevTubeVideoData = require("../models/devTubeVideoData");
const DevTubeUser = require("../models/userModal");
const VideoModal = require("../models/videoModal");
const asyncHandler = require("express-async-handler");
const { fetchUserHistory } = require("./userControllers");
const DevTubeVideo = require("../models/videoModal");

const fetchVideos = asyncHandler(async (req, res) => {
  const key = req.user._id;
  if (key) {
    const allVideos = await VideoModal.find({ userId: key }).sort({
      updatedAt: -1,
    });
    res.status(200).json(allVideos);
  } else {
    res.status(400);
    throw new Error("Unable to load your videos");
  }
});

const addVideo = asyncHandler(async (req, res) => {
  try {
    const data = req.body;

    const newVideo = new VideoModal({ userId: req.user._id, ...data });

    const savedVideo = await newVideo.save();
    // res.status(200).json(savedVideo);
    if (savedVideo) {
      await fetchVideos(req, res);
    }
  } catch (error) {
    res.status(400);
    throw new Error("Can not create video");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  try {
    const video = await VideoModal.findById(req.params.id);

    if (!video) {
      res.status(404);
      throw new Error("Video not found");
      return;
    }
    if (video.userId != req.user._id) {
      res.status(401);
      throw new Error("Can not Update Video.");
    } else {
      const updatedVideo = await VideoModal.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      if (updatedVideo) {
        await fetchVideos(req, res);
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error("Can not update video");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await VideoModal.findById(videoId);

    if (!video) {
      res.status(404);
      throw new Error("Video not found");
      return;
    }
    if (video.userId != req.user._id) {
      res.status(401);
      throw new Error("Can not Delete Video.");
    } else {
      const deleteVideoData = await DevTubeVideoData.findOneAndDelete({
        videoId: req.params.id,
      });
      const deletedVideo = await VideoModal.findByIdAndDelete(req.params.id);
      const deleteFromAllUsers = await DevTubeUser.updateMany(
        { history: videoId },
        { $pull: { history: videoId } }
      );

      if (deletedVideo && deleteFromAllUsers) {
        await fetchVideos(req, res);
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error("Can not delete video");
  }
});

const findVideo = asyncHandler(async (req, res) => {
  try {
    const video = await VideoModal.findById(req.params.id);
    res.status(200).json(video);
  } catch (error) {
    res.status(400);
    throw new Error("Can not find video");
  }
});

const addView = asyncHandler(async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user._id;

    const video = await VideoModal.findById(videoId);

    if (!video) {
      res.status(404);
      throw new Error("Video not found.");
    }

    video.views += 1;
    await video.save();

    let videoData = await DevTubeVideoData.findOne({ userId, videoId });
    let user = await DevTubeUser.findOne({ _id: userId }).populate({
      path: "history",
      populate: { path: "videoId", model: "DevTubeVideo" },
      options: { sort: { updatedAt: -1 } }, // Sort by 'updatedAt' in descending order
    });
    if (videoData) {
      const videoIdString = String(videoId);

      if (
        !user.history.some((item) => String(item.videoId._id) == videoIdString)
      ) {
        videoData.timeCompleted.hours = 0;
        videoData.timeCompleted.minutes = 0;
        videoData.timeCompleted.seconds = 0;
        videoData.updatedAt = new Date();
        await videoData.save();
        user.history.push(videoData);
        await user.save();
      } else {
        videoData.updatedAt = new Date();
        await videoData.save();
      }
    } else {
      videoData = new DevTubeVideoData({ userId, videoId });
      await videoData.save();
      user.history.push(videoData);
      await user.save();
    }
    const updatedUser = await DevTubeUser.findOne({ _id: userId }).populate({
      path: "history",
      populate: { path: "videoId", model: "DevTubeVideo" },
      options: { sort: { updatedAt: -1 } }, // Sort by 'updatedAt' in descending order
    });
    // Extract the sorted history from the user
    const sortedHistory = updatedUser.history.map((item) => item.toObject());

    res.status(200).json(sortedHistory);
  } catch (error) {
    res.status(400);

    throw new Error(error);
  }
});

const trend = asyncHandler(async (req, res) => {
  try {
    const videos = await DevTubeVideo.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (error) {
    res.status(400);
    throw new Error("Can not load video");
  }
});

const random = asyncHandler(async (req, res) => {
  try {
    const videos = await DevTubeVideo.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (error) {
    res.status(400);
    throw new Error("Can not load video");
  }
});

const sub = asyncHandler(async (req, res) => {
  try {
    const user = await DevTubeUser.findById(req.user._id);
    const subscribedChannel = user.subscribedUsers;
    const list = await Promise.all(
      subscribedChannel.map((channelId) => {
        return DevTubeVideo.find({ userId: channelId });
      })
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    res.status(400);
    throw new Error("Can not load video");
  }
});

const tag = asyncHandler(async (req, res) => {
  try {
    const tags = req.query.tags.split(",");

    const videos = await DevTubeVideo.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (error) {
    res.status(400);
    throw new Error("Can not load video");
  }
});

const search = asyncHandler(async (req, res) => {
  const query = req.query.q;
  try {
    const videos = await DevTubeVideo.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { desc: { $regex: query, $options: "i" } },
      ],
    }).limit(50);
    res.status(200).json(videos);
  } catch (error) {
    res.status(400);
    throw new Error("Can not load video");
  }
});

const addTime = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const videoId = req.params.id;
  const { hour, min, second } = req.body;

  try {
    const findVideoData = await DevTubeVideoData.findOneAndUpdate(
      { userId, videoId },
      {
        $set: {
          "timeCompleted.hours": hour,
          "timeCompleted.minutes": min,
          "timeCompleted.seconds": second,
        },
      },
      { new: true }
    );

    if (findVideoData) {
      await fetchUserHistory(req, res);
    } else {
      res.status(404);
      throw new Error(" Can not update time.");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Internal Server Error.");
  }
});

module.exports = {
  search,
  tag,
  sub,
  random,
  trend,
  addVideo,
  updateVideo,
  deleteVideo,
  findVideo,
  addView,
  fetchVideos,
  addTime,
};
