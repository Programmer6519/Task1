import { MainTodo } from "../models/mainTodo_models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isOwner = asyncHandler(async (req, res, next) => {
  const { mainTodoId } = req.body;
  if (!mainTodoId) {
    throw new ApiError(400, "Main Todo Id is required");
  }
  const mainTodo = await MainTodo.find({ _id: mainTodoId });
  if (!mainTodo[0]) {
    throw new ApiError(400, "Invalid Main Todo Id");
  }
  if (!(mainTodo[0].userId == req.decodeToken._id)) {
    throw new ApiError(400, "Unauthorized request");
  }
  req.isOwner = true;
  next();
});
