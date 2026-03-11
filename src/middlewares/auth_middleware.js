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
    req.decodeToken = decodeToken;
    next();
  } catch (error) {
    throw new ApiError(400, error.message || "Invalid accessToken");
  }
});
