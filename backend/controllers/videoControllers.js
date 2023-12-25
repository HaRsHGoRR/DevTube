const DevTubeUser = require("../models/userModal");
const VideoModal = require("../models/videoModal");
const asyncHandler = require("express-async-handler");

export const addVideo = asyncHandler(async (req, res) => {
  try {
    const data = req.body;

    const newVideo = new VideoModal({ userId: req.user._id, ...data });

    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (error) {
    res.status(400);
    throw new Error("Can not create video");
  }
});

export const updateVideo = asyncHandler(async (req, res) => {
  try {
    const video=await VideoModal.findById(req.params.id)

    if(!video){
        res.status(404)
        throw new Error("Video not found")
        return
    }

    


  } catch (error) {
    res.status(400);
    throw new Error("Can not update video");
  }
});

export const deleteVideo = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(400);
    throw new Error("Can not delete video");
  }
});

export const findVideo = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(400);
    throw new Error("Can not find video");
  }
});

export const addView = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(400);
    throw new Error("Can not add view video");
  }
});

export const trend = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(400);
    throw new Error("Can not load video");
  }
});

export const random = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(400);
    throw new Error("Can not load video");
  }
});

export const sub = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(400);
    throw new Error("Can not load video");
  }
});

export const tag = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(400);
    throw new Error("Can not load video");
  }
});

export const search = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(400);
    throw new Error("Can not create video");
  }
});
