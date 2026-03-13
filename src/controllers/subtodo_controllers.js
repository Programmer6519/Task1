import { Query } from "mongoose";
import { MainTodo } from "../models/mainTodo_models.js";
import { SubTodo } from "../models/subTodo_models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createSubTodo = asyncHandler(async (req, res) => {
  const { title, content, mainTodoId, status } = req.body;
  if (!title || !content) {
    throw new ApiError(400, "All fields are required");
  }

  const subTodo = await SubTodo.create({
    title,
    content,
    status,
    mainTodoId,
  });

  return res
    .status(200)
    .json({ success: true, message: "subTodo created successfully", subTodo });
});

export const getSubTodo = asyncHandler(async (req, res) => {
  const { mainTodoId, subTodoId, status } = req.body;

  const totalSubtodosCount = await SubTodo.countDocuments({ mainTodoId });
  const completedSubtodos = await SubTodo.countDocuments({
    status: "completed",
    mainTodoId,
  });
  const pendingSubtodos = await SubTodo.countDocuments({
    status: "pending",
    mainTodoId,
  });
  const inProgressSubtodos = await SubTodo.countDocuments({
    status: "inProgress",
    mainTodoId,
  });

  const query = { mainTodoId };
  if (subTodoId) {
    query._id = subTodoId;
  }
  if (status) {
    query.status = status;
  }

  const subTodos = await SubTodo.find(query);

  return res.status(200).json({
    success: true,
    subTodos,
    totalSubtodosCount,
    completedSubtodos,
    pendingSubtodos,
    inProgressSubtodos,
  });
});

export const updateSubTodo = asyncHandler(async (req, res) => {
  const { title, content, status, subTodoId, mainTodoId } = req.body;

  if (!subTodoId) {
    throw new ApiError(400, "subTodo Id is required");
  }

  const subTodo = await SubTodo.find({
    _id: subTodoId,
    mainTodoId,
  });

  subTodo[0].content = content ? content : subTodo[0].content;
  subTodo[0].title = title && title;
  subTodo[0].status = status ? status : subTodo[0].status;
  await subTodo[0].save();
  return res.status(200).json({
    success: true,
    message: "SubTodo is updated successfully",
    subTodo,
  });
});

export const deleteSubTodo = asyncHandler(async (req, res) => {
  const { subTodoId } = req.body;
  if (!subTodoId) {
    throw new ApiError(400, "SubTodo Id is required");
  }

  const subTodo = await SubTodo.find({ _id: subTodoId });
  console.log(subTodo);

  if (!subTodo[0]) {
    throw new ApiError(400, "Invalid SubTodo Id");
  }

  await subTodo[0].deleteOne();
  return res
    .status(200)
    .json({ success: true, message: "SubTodo deleted successfully" });
});
