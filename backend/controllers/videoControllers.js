const DevTubeVideoData = require("../models/devTubeVideoData");
const DevTubeUser = require("../models/userModal");
const VideoModal = require("../models/videoModal");
const asyncHandler = require("express-async-handler");
const { fetchUserHistory } = require("./userControllers");
const DevTubeVideo = require("../models/videoModal");
const DevTubeViews = require("../models/viewModal");
const DevTubeUserPlaylist = require("../models/playListModal");
const { default: mongoose } = require("mongoose");

const fetchVideos = asyncHandler(async (req, res) => {
  const key = req.user._id;
  if (key) {
    const allVideos = await VideoModal.find({ userId: key }).sort({
      updatedAt: -1,
    });
    res.status(200).json(allVideos);
  } else {
    res.status(400);
    throw new Error("Unable to load videos");
  }
});

const addVideo = asyncHandler(async (req, res) => {
  try {
    const data = req.body;
    data.tags = JSON.parse(data.tags);
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
    const data = req.body;
    data.tags = JSON.parse(data.tags);
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
        { $set: data },
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
    let videoId = req.params.id;

    const video = await VideoModal.findById(videoId);
    videoId = new mongoose.Types.ObjectId(videoId);
    if (!video) {
      res.status(404);
      throw new Error("Video not found");
      return;
    }
    if (video.userId != req.user._id) {
      res.status(401);
      throw new Error("Can not Delete Video.");
    } else {
      await DevTubeUserPlaylist.updateMany(
        { "videos.videoId": videoId },
        { $pull: { videos: { videoId: videoId } } }
      );
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
    console.log(error);
    res.status(400);
    throw new Error("Can not delete video");
  }
});

const findVideo = asyncHandler(async (req, res) => {
  try {
    const video = await VideoModal.findById(req.params.id);
    const user = await DevTubeUser.findById(video.userId).select(
      "name img subscribers"
    );

    res.status(200).json({ ...video._doc, user });
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

    let findUser = await DevTubeViews.findOne({ videoId });

    if (!findUser) {
      // If findUser doesn't exist, create a new instance
      findUser = new DevTubeViews({
        videoId: videoId,
        user: [userId],
      });
      await findUser.save();
      video.views += 1;
      await video.save();
    }
    if (!findUser.user.includes(userId)) {
      findUser.user.push(userId);
      await findUser.save();
      video.views += 1;
      await video.save();
    }

    // video.views += 1;
    // await video.save();

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
        videoData.timeCompleted = 0;

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

    const videoPromises = videos.map(async (video) => {
      const user = await DevTubeUser.findById(video.userId).select("name img");
      return {
        ...video._doc,
        userId: {
          userId: video.userId,
          userName: user.name,
          userImg: user.img,
        },
      };
    });

    const videosWithUser = await Promise.all(videoPromises);

    res.status(200).json(videosWithUser);
  } catch (error) {
    res.status(400).json({ error: "Can not load video" });
  }
});

const random = asyncHandler(async (req, res) => {
  try {
    let videos = await DevTubeVideo.aggregate([{ $sample: { size: 40 } }]);

    const videoPromises = videos.map(async (video) => {
      const user = await DevTubeUser.findById(video.userId).select("name img");
      return {
        ...video,
        userId: {
          userId: video.userId,
          userName: user.name,
          userImg: user.img,
        },
      };
    });

    const videosWithUser = await Promise.all(videoPromises);

    res.status(200).json(videosWithUser);
  } catch (error) {
    res.status(400);
    throw new Error("Can not load video");
  }
});

const sub = asyncHandler(async (req, res) => {
  try {
    const user = await DevTubeUser.findById(req.user._id);
    const subscribedChannel = user.subscribedUsers;
    const videosList = await Promise.all(
      subscribedChannel.map(async (channelId) => {
        const videos = await DevTubeVideo.find({ userId: channelId });

        // Extract only necessary fields from each video
        const modifiedVideos = videos.map(async (video) => {
          const videoUser = await DevTubeUser.findById(video.userId).select(
            "name img"
          );

          // Extract only necessary fields from user
          const userInfo = {
            userId: video.userId,
            userName: videoUser.name,
            userImg: videoUser.img,
          };

          return {
            ...video._doc, // Include all fields from the video document
            userId: userInfo,
          };
        });

        return Promise.all(modifiedVideos);
      })
    );

    const flattenedList = videosList
      .flat()
      .sort((a, b) => b.updatedAt - a.updatedAt);

    res.status(200).json(flattenedList);
  } catch (error) {
    res.status(400).json({ error: "Can not load video" });
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
  const { second } = req.body;

  try {
    const findVideoData = await DevTubeVideoData.findOneAndUpdate(
      { userId, videoId },
      {
        $set: {
          timeCompleted: second,
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

const like = asyncHandler(async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user._id;

    const findVideo = await DevTubeVideo.findById(videoId).select(
      "likes disLikes"
    );

    if (findVideo) {
      const likes = findVideo.likes;
      const dislikes = findVideo.disLikes;

      // Check if userId is present in likes array
      const userIndexInLikes = likes.indexOf(userId);

      if (userIndexInLikes === -1) {
        // If userId is not present in likes, add it to likes array
        findVideo.likes.push(userId);
      } else {
        // If userId is present in likes, remove it from likes array
        findVideo.likes.splice(userIndexInLikes, 1);
      }

      // Check if userId is present in dislikes array
      const userIndexInDislikes = dislikes.indexOf(userId);

      if (userIndexInDislikes !== -1) {
        // If userId is present in dislikes, remove it from dislikes array
        findVideo.disLikes.splice(userIndexInDislikes, 1);
      }

      // Save the updated video
      await findVideo.save();

      res.status(200).json(findVideo);
    } else {
      throw new Error("Can not find Video.");
    }
  } catch (error) {
    res.status(500);
    throw error;
  }
});

const dislike = asyncHandler(async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user._id;

    const findVideo = await DevTubeVideo.findById(videoId).select(
      "likes disLikes"
    );

    if (findVideo) {
      const likes = findVideo.likes;
      const dislikes = findVideo.disLikes;

      // Check if userId is present in dislikes array
      const userIndexInDislikes = dislikes.indexOf(userId);

      if (userIndexInDislikes === -1) {
        // If userId is not present in dislikes, add it to dislikes array
        findVideo.disLikes.push(userId);
      } else {
        // If userId is present in dislikes, remove it from dislikes array
        findVideo.disLikes.splice(userIndexInDislikes, 1);
      }

      // Check if userId is present in likes array
      const userIndexInLikes = likes.indexOf(userId);

      if (userIndexInLikes !== -1) {
        // If userId is present in likes, remove it from likes array
        findVideo.likes.splice(userIndexInLikes, 1);
      }

      // Save the updated video
      await findVideo.save();

      res.status(200).json(findVideo);
    } else {
      throw new Error("Can not find Video.");
    }
  } catch (error) {
    res.status(500);
    throw error;
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
  like,
  dislike,
};
