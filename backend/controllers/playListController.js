const DevTubeUserPlaylist = require("../models/playListModal");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const createPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let { name, desc, videoIds } = req.body;
  videoIds = JSON.parse(videoIds);
  try {
    const playlist = new DevTubeUserPlaylist({
      name,
      desc,
      userId,
      videos: videoIds.map((videoId) => ({
        videoId: new mongoose.Types.ObjectId(videoId),
        timeAdded: Date.now(),
      })),
    });

    const savedPlaylist = await playlist.save();

    if (savedPlaylist) {
      await fetchPlaylists(req, res);
    } else {
      throw new Error("Can not create Playlist.");
    }
  } catch (error) {
    console.log(error);
    res.status(500);

    throw new Error(error);
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const playListId = req.params.id;
  try {
    const deletePlaylist = await DevTubeUserPlaylist.findByIdAndDelete(
      playListId
    );

    if (deletePlaylist) {
      await fetchPlaylists(req, res);
    } else {
      throw new Error("Can not delete Playlist.");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

const fetchPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const playlists = await DevTubeUserPlaylist.find({ userId }).populate(
      "videos.videoId"
    );
    res.status(200).json(playlists);
  } catch (error) {
    res.status(404);
    throw new Error("Can not load Playlists.");
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const playListId = req.params.id;
  let data = req.body;

  try {
    const updatePlaylist = await DevTubeUserPlaylist.findByIdAndUpdate(
      playListId,
      { ...data }
    );

    if (updatePlaylist) {
      await fetchPlaylists(req, res);
    } else {
      throw new Error("Can not update Playlist.");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;
  const { videoId } = req.body;
  try {
    const playlist = await DevTubeUserPlaylist.findById(playlistId);
    if (!playlist) {
      throw new Error("Playlist not found");
    }

    const isVideoAlreadyAdded = playlist.videos.some(
      (v) => v.videoId.toString() == videoId
    );

    if (!isVideoAlreadyAdded) {
      playlist.videos.push({
        videoId: new mongoose.Types.ObjectId(videoId),
      });

      await playlist.save();
      playlists = await DevTubeUserPlaylist.findById(playlistId).populate({
        path: "videos.videoId",
        model: "DevTubeVideo",
      });
      res.status(200).json(playlists);
    } else {
      throw new Error("Video already exists in the playlist");
    }
  } catch (error) {
    res.status(500);
    throw error;
  }
});

const removeVideoToPlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;
  const { videoId } = req.body;
  try {
    const updatedPlaylist = await DevTubeUserPlaylist.findByIdAndUpdate(
      playlistId,
      {
        $pull: { videos: { videoId: new mongoose.Types.ObjectId(videoId) } },
      },
      { new: true }
    );

    if (!updatedPlaylist) {
      throw new Error("Playlist not found");
    } else {
      playlists = await DevTubeUserPlaylist.findById(playlistId).populate({
        path: "videos.videoId",
        model: "DevTubeVideo",
      });
      res.status(200).json(playlists);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    throw error;
  }
});

module.exports = {
  updatePlaylist,
  fetchPlaylists,
  deletePlaylist,
  createPlaylist,
  addVideoToPlaylist,
  removeVideoToPlaylist,
};
