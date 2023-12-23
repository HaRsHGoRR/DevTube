require("dotenv").config();
const nodemailer = require("nodemailer");
const generateOtp = require("./generateOtp");

const sendEmail = async (email) => {
  try {
    const otp = generateOtp();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "DevTube-OTP Verification",
      text: `OTP for verification is ${otp}`,
    });

    return {
      status: "success",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      status: "failed",
      error: error.message,
    };
  }
};

module.exports = { sendEmail };
