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
  fetchUserHistory,
  deleteUserHistory,
  authenticateUser,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authorization");

const router = express.Router();
// authenticate user
router.post("/authenticate", authenticateUser);


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
router.post("/watch/:id", protect, addWatchLater);
router.get("/watch", protect, fetchWatchLater);
router.put("/watch/:id", protect, updateWatchLater);
router.delete("/watch", protect, deleteWatchLater);

// history apis

router.get("/history", protect, fetchUserHistory);
router.delete("/history", protect, deleteUserHistory);

module.exports = router;
