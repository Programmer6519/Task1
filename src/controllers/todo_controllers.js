import { MainTodo } from "../models/mainTodo_models.js";
import { User } from "../models/user_models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const createTodo = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    throw new ApiError(400, "All fields are required");
  }

  const todo = await MainTodo.create({
    title: title,
    content: content,
    userId: req.decodeToken._id,
  });

  res.json({ message: "todo created successfully", todo }).status(200);
});

export const getTodo = asyncHandler(async (req, res) => {
  const { maintodoid } = req.body;
  const totalMaintodosCount = await MainTodo.countDocuments({});
  const completedMaintodos = await MainTodo.countDocuments({
    status: "Completed",
  });
  const pendingMaintodos = await MainTodo.countDocuments({ status: "Pending" });
  const inProgressMaintodos = await MainTodo.countDocuments({
    status: "InProgress",
  });
  if (maintodoid) {
    const todo = await MainTodo.find({ _id: maintodoid });
    if (!todo[0]) {
      throw new ApiError(400, "Invalid id");
    }
    res
      .json({
        todo,
        totalMaintodosCount,
        completedMaintodos,
        pendingMaintodos,
        inProgressMaintodos,
      })
      .status(200);
  } else {
    const todoList = await MainTodo.find({ userId: req.decodeToken._id });

    if (!todoList[0]) {
      throw new ApiError(400, "There are no todos");
    }
    res
      .json({
        todoList,
        totalMaintodosCount,
        completedMaintodos,
        pendingMaintodos,
        inProgressMaintodos,
      })
      .status(200);
  }
});

export const updateTodo = asyncHandler(async (req, res) => {
  const { title, content, status, todoid } = req.body;

  if (!todoid) {
    throw new ApiError(400, "Todo Id is required");
  }

  const todo = await MainTodo.find({
    _id: todoid,
    userId: req.decodeToken._id,
  });
  if (!todo[0]) {
    throw new ApiError(401, "Id is invalid");
  }

  todo[0].content = content;
  todo[0].title = title;
  todo[0].status = status;
  await todo[0].save();
  res.status(200).json({ todo });
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const { todoid } = req.body;

  const todo = await MainTodo.find({
    _id: todoid,
    userId: req.decodeToken._id,
  });
  if (!todo[0]) {
    throw new ApiError(404, "Not Found");
  }

  await MainTodo.deleteOne({ _id: todoid });
  res.status(200).json({ message: "todo deleted successfully" });
});
