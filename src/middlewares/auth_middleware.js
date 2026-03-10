import { User } from "../models/user_models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    if (!req.cookies.accessToken) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const token =
      req.cookies.accessToken ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized Access Token");
    }
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decodeToken._id);
    const user = await User.find({ _id: decodeToken._id });
    if (user.length < 1) {
      throw new ApiError(401, "Invalid Access Token");
    }
    console.log(user);
    const authUser = await user[0].toObject();

    delete authUser.password;
    delete authUser.refreshToken;
    req.user = authUser;
    next();
  } catch (error) {
    throw new ApiError(400, error.message || "Invalid accessToken");
  }
});
