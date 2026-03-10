import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const createTodo = asyncHandler(async (req, res) => {
  const { title, content, status } = req.body;
  if (!title || !content || status) {
    throw new ApiError(400, "All fields are required");
  }
});
