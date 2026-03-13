import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user_models.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";

const otps = [];
const verifiedEmails = [];

const isEmailValid = (email) => {
  const emailWithoutspaces = email.replace(" ", "");
  if (emailWithoutspaces !== email) {
    return false;
  }
  if (emailWithoutspaces.indexOf("@") <= 0) {
    return false;
  }
  if (!email.includes("@") || !email.includes(".com")) {
    return false;
  }

  return true;
};

const isEmailVerified = (email, arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].email === email && arr[i].expDate > Date.now() / 1000) {
      return true;
    }
  }
  return false;
};

export const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!isEmailValid(email)) {
    throw new ApiError(400, "Email is invalid");
  }
  let isEmailFound = false;
  const otp = Math.floor(Math.random() * 9000 + 1000);
  const date = Date.now() / 1000 + 120;
  for (let i = 0; i < otps.length; i++) {
    if (
      otps[i].email === email &&
      otps[i].count > 2 &&
      otps[i].requestTimeLimit > Date.now() / 1000
    ) {
      throw new ApiError(400, "Otps limit reached and try again in 5 minutes");
    }

    if (
      otps[i].email === email &&
      otps[i].count > 2 &&
      otps[i].requestTimeLimit < Date.now() / 1000
    ) {
      otps[i].count = 0;
    }

    if (otps[i].email == email && otps[i].count == 2) {
      isEmailFound = true;
      otps[i].count++;
      otps[i].expDate = date;
      otps[i].otp = otp;
      otps[i].requestTimeLimit = Date.now() / 1000 + 300;
      break;
    }

    if (otps[i].email === email) {
      isEmailFound = true;
      otps[i].count++;
      otps[i].expDate = date;
      otps[i].otp = otp;
      break;
    }
  }
  if (!isEmailFound) {
    otps.push({ email: email, otp: otp, expDate: date, count: 1 });
  }
  return res
    .status(200)
    .json({ success: true, message: "otp sent successfully", otp: otp });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new ApiError(400, "Email and otp required");
  }
  if (!isEmailValid(email)) {
    throw new ApiError(400, "Email is invalid");
  }
  let isverified = isEmailVerified(email, otps);

  if (!isverified) {
    throw new ApiError(400, "otp is expired or invalid");
  }
  verifiedEmails.push({ email });
  return res
    .status(200)
    .json({ success: true, message: "verified successfully" });
});

export const signupUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    throw new ApiError(400, "All fields are required");
  }
  if (!isEmailValid(email)) {
    throw new ApiError(400, "Email is invalid");
  }
  if (!isEmailVerified(email, verifiedEmails)) {
    throw new ApiError(400, "Go and verify email");
  }

  const userExists = await User.find({ email: email });
  if (userExists[0]) {
    throw new ApiError(400, "User already Exists");
  }
  const user = await User.create({
    email: email,
    name: name,
    password: await bcrypt.hash(password, 10),
  });

  const newAccessToken = await user.generateAccessToken();
  const newRefreshToken = await user.generateRefreshToken();
  user.refreshToken = newRefreshToken;

  await user.save({ validateBeforeSave: false });
  const resUser = user.toObject();
  delete resUser.password;
  delete resUser.refreshToken;

  return res.status(200).json({
    success: true,
    message: "User created Successfully",
    resUser,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "email and password required");
  }
  const user = await User.find({ email: email });
  if (!user[0]) {
    throw new ApiError(400, "Email or password is incorrect");
  }
  const isPasswordValid = await bcrypt.compare(password, user[0].password);

  if (!isEmailValid(email)) {
    throw new ApiError(400, "Email is invalid");
  }

  const newAccessToken = await user[0].generateAccessToken();
  const newRefreshToken = await user[0].generateRefreshToken();
  user[0].refreshToken = newRefreshToken;
  const resUser = user[0].toObject();
  delete resUser.password;
  delete resUser.refreshToken;

  await user[0].save({ validateBeforeSave: false });
  return res.status(200).json({
    success: true,
    message: "User logged In successfully",
    resUser,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.find({ _id: req.decodeToken._id });
  user[0].refreshToken = "";
  user[0].save({ validateBeforeSave: false });
  return res.json({
    message: "User logged out successfully",
  });
});
