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

router.post("/", protect, addComment);
router.get("/", protect, fetchComments);
router.delete("/", protect, deleteComment);
router.put("/:id", protect, updateComment);


module.exports = router;
