const express = require("express");
const {
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
  dislike,
  like,
  addWatchLater,
  fetchWatchLater,
  updateWatchLater,
  deleteWatchLater,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authorization");

const router = express.Router();

// /user api
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", protect, updateUser);
router.delete("/delete", protect, deleteUser);
router.get("/find/:id", protect, findUser);

// user action api like sub unsub like dislike
router.put("/sub/:id", protect, subscribe);
router.put("/unsub/:id", protect, unsubscribe);
router.put("/like/:videoId", protect, like);
router.put("/dislike/:videoId", protect, dislike);


// email sending and verifing api
router.post("/sendemail", sendEmail);
router.post("/verifyemail", verifyEmail);

// password reseting apis
router.put("/forgotpassword", forgotpassword);
router.put("/resetpassword", protect, resetpassword);


// watch later apis
router.post("/watch", protect, addWatchLater);
router.get("/watch", protect, fetchWatchLater);
router.put("/watch", protect, updateWatchLater);
router.delete("/watch", protect, deleteWatchLater);

module.exports = router;
