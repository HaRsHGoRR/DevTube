const DevTubeComment = require("../models/commentModal");
const asyncHandler = require("express-async-handler");
const DevTubeVideo = require("../models/videoModal");

const addComment = asyncHandler(async (req, res) => {
  const data = req.body;
  const userId = req.user._id;

  try {
    const newComment = new DevTubeComment({ ...data, userId });
    const savedComment = await newComment.save();
    if (savedComment) {
      await fetchComments(req, res);
    } else {
      throw new Error("Can not add Commnet.");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const updateComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  try {
    const updateComm = await DevTubeComment.findByIdAndUpdate(
      commentId,
      { $set: req.body },
      { new: true }
    );
    if (updateComm) {
      await fetchComments(req, res);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
const fetchComments = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  try {
    const comments = await DevTubeComment.find({ videoId }).populate("userId","name img");
    res.status(200).json(comments);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
const deleteComment = asyncHandler(async (req, res) => {
  const  {commentId}  = req.body;
  const userId = req.user._id;
  try {
    const comment = await DevTubeComment.findById(commentId);
    const video = await DevTubeVideo.findById(comment.videoId);
    
    

    if (
      String(userId) == String(video.userId) ||
      String(userId) == String(comment.userId)
    ) {
      const deleteComment = await DevTubeComment.findByIdAndDelete(commentId);
      if (deleteComment) {
        await fetchComments(req, res);
      } else {
        throw new Error("Can not delete Commnet.");
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

module.exports = { addComment, deleteComment, fetchComments, updateComment };
