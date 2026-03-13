import { User } from "../models/user_models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      throw new ApiError(401, "Unauthorized Access Token");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const currentTime = Date.now() / 1000;
    if (decodeToken.exp < currentTime) {
      throw new ApiError(400, "Access Token is expired");
    }
    req.decodeToken = decodeToken;
    next();
  } catch (error) {
    throw new ApiError(400, error.message || "Invalid accessToken");
  }
});
