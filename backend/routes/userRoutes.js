const express = require("express");
const {
  registerUser,
  loginUser,
  sendEmail,
  verifyEmail,
  forgotpassword,
  resetpassword,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authorization");

const router = express.Router();

// /user
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/sendemail", sendEmail);
router.post("/verifyemail", verifyEmail);
router.put("/forgotpassword", forgotpassword);
router.put("/resetpassword", protect, resetpassword);

module.exports = router;
