import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user_models.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";

const isPasswordCorrect = async function (hashPassword, givenPassword) {
  const isPasswordValid = await bcrypt.compare(givenPassword, hashPassword);
  return isPasswordValid;
};
const options = {
  httpOnly: true,
  secure: true,
};

export const signupUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password is required");
  }
  if (!name) {
    throw new ApiError(400, "name is required");
  }
  const searchUser = await User.find({ email: email }); //set

  if (searchUser.length > 0) {
    throw new ApiError(400, "User already Exists");
  }
  const newUser = await User.create({
    email: email,
    name: name,
    password: password,
  });
  const resUser = newUser.toObject();
  delete resUser.password;

  res.status(200).json({ resUser, message: "User created Successfully" });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "email and password required");
  }
  const user = await User.find({ email: email });
  if (user.length < 1) {
    throw new ApiError(400, "Email or password is incorrect");
  }
  const isPasswordValid = await isPasswordCorrect(user[0].password, password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Email or password is incorrect");
  }
  const newAccessToken = await user[0].generateAccessToken();
  const newRefreshToken = await user[0].generateRefreshToken();
  user[0].refreshToken = newRefreshToken;

  await user[0].save({ validateBeforeSave: false });
  res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json({
      message: "User logged In successfully",
    });
});

export const logoutUser = asyncHandler(async (req, res) => {
  // console.log(refreshToken._id);

  const user = req.user;
  const registeredUser = await User.find({ _id: user._id });
  // console.log(registeredUser[0]);
  registeredUser[0].refreshToken = "";
  await registeredUser[0].save({ validateBeforeSave: false });

  res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      message: "User logged out successfully",
    });
});
