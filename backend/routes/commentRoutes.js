const express = require("express");
const { protect } = require("../middlewares/authorization");
const {
  addComment,
  fetchComments,
  deleteComment,
  updateComment,
} = require("../controllers/commentController");

const router = express.Router();

// crud on comments

router.post("/add", protect, addComment);
router.post("/", protect, fetchComments);
router.post("/delete", protect, deleteComment);
router.put("/:id", protect, updateComment);


module.exports = router;
