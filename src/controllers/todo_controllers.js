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

  if (!req.cookies.accessToken) {
    throw new ApiError(400, "User login required");
  }

  const decodeToken = jwt.verify(
    req.cookies.accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  const user = await User.find({ _id: decodeToken._id });
  if (!user[0]) {
    throw new ApiError(401, "Invalid token");
  }
  const todo = await MainTodo.create({
    title: title,
    content: content,
    userId: decodeToken._id,
  });

  res.json({ message: "todo created successfully", todo }).status(200);
});

export const getTodo = asyncHandler(async (req, res) => {
  if (!req.cookies.accessToken) {
    throw new ApiError(400, "Unauthorized request");
  }

  const decodeToken = jwt.verify(
    req.cookies.accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  const todoList = await MainTodo.find({ userId: decodeToken._id });

  if (!todoList[0]) {
    throw new ApiError(400, "There are no todos");
  }
  res.json({ todoList }).status(200);
});

export const updateTodo = asyncHandler(async (req, res) => {
  const { title, content, status } = req.body;

  if (!req.cookies.accessToken) {
    throw new ApiError(400, "Unauthorized request");
  }

  const decodeToken = jwt.verify(
    req.cookies.accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  if (!req.query.todoid) {
    throw new ApiError(400, "Todo Id is required");
  }
  const user = await User.find({ _id: decodeToken._id });
  if (!user[0]) {
    throw new ApiError(401, "Invalid token");
  }

  const todo = await MainTodo.find({
    _id: req.query.todoid,
    userId: decodeToken._id,
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
  if (!req.cookies.accessToken) {
    throw new ApiError(400, "User login required");
  }

  const decodeToken = jwt.verify(
    req.cookies.accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  const user = await User.find({ _id: decodeToken._id });
  const todo = await MainTodo.find({
    _id: req.query.todoid,
    userId: user[0]._id,
  });
  if (!todo[0]) {
    throw new ApiError(404, "Not Found");
  }
  if (!user[0]) {
    throw new ApiError(401, "Invalid token");
  }

  await MainTodo.deleteOne({ _id: req.query.todoid });
  res.status(200).json({ message: "todo deleted successfully" });
});
